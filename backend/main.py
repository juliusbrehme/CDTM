from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import iso18245
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import threading
from datetime import datetime
import re

app = FastAPI()

bankingDataframe = pd.DataFrame()
tradingDataframe = pd.DataFrame()
data_lock = threading.Lock()
data_loaded = threading.Event()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_data():
    global bankingDataframe
    try:
        print("Starting to load data in background...")
        banking_temp = pd.read_csv("./data/banking_sample_data.csv")
        # sliced_df = banking_temp.iloc[310:370]
        sliced_df = banking_temp[banking_temp["userId"] == "0bf3b550-dc5b-4f3e-91f4-162b687b97c6"]
        sliced_df = sliced_df.replace([float('inf'), float('-inf')], None).fillna('')
        sliced_df['side'] = sliced_df['side'].str.strip().str.lower()
        sliced_df['category'] = sliced_df['mcc'].apply(map_mcc_to_grouping)

        # Step 1: Convert to datetime
        sliced_df["bookingDate"] = pd.to_datetime(sliced_df["bookingDate"], errors='coerce')
        # Step 2: Sort by most recent date
        sliced_df = sliced_df.sort_values(by="bookingDate", ascending=False)
        # Step 3: Convert datetime back to string (ISO format or custom format like '%Y-%m-%d')
        sliced_df["bookingDate"] = sliced_df["bookingDate"].dt.strftime('%Y-%m-%d')

        bankingDataframe=sliced_df

        trading_temp = pd.read_csv("./data/trading_sample_data.csv")
    except Exception as e:
        print(f"Failed to load data: {e}")

with open("./data/mcc_grouped.json", "r") as f:
    MCC_GROUPS = json.load(f)

def map_mcc_to_grouping(mcc_code):
    """
    Maps an MCC code to its grouping name based on the JSON file.
    :param mcc_code: The MCC code to map.
    :return: The grouping name or "Unknown" if not found.
    """
    try:
        if pd.isna(mcc_code) or mcc_code == "":
            return "Unknown"
        mcc_code = int(float(mcc_code))  # Ensure MCC is an integer
        for group, mcc_list in MCC_GROUPS.items():
            for mcc_entry in mcc_list:
                if mcc_entry.get("mcc") == mcc_code:
                    return group
        return "Unknown"
    except Exception:
        return "Unknown"

# MCC → Kategorie-Mapping
def map_mcc_to_category(mcc_code):
    try:
        if pd.isna(mcc_code) or mcc_code == "":
            return "Unknown"
        mcc_obj = iso18245.get_mcc(str(int(float(mcc_code))))
        return (
            mcc_obj.visa_description
            or mcc_obj.stripe_description
            or mcc_obj.iso_description
            or "Unknown"
        )
    except Exception:
        return "Unknown"


@app.get("/api/transactions")
def read_transactions(
    user: str = Query(None),
    limit: int = Query(None, ge=1),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    """
    Reads transactions from the CSV file. If a user is specified, filters transactions for that user.
    Allows filtering by date range and limiting the number of results.
    :param user: Optional user ID to filter transactions.
    :param limit: Optional limit on the number of transactions to return.
    :param start_date: Optional start date to filter transactions (format: YYYY-MM-DD).
    :param end_date: Optional end date to filter transactions (format: YYYY-MM-DD).
    """
    df = pd.read_csv("./data/banking_sample_data.csv")
    df = df.replace([float('inf'), float('-inf')], None).fillna('')

    # Convert bookingDate to datetime for filtering
    df['bookingDate'] = pd.to_datetime(df['bookingDate'], errors='coerce')

    # Filter by user if provided
    if user is not None:
        df = df[df['userId'] == user]

    # Filter by date range if provided
    if start_date is not None:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        df = df[df['bookingDate'] >= start_date]
    if end_date is not None:
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
        df = df[df['bookingDate'] <= end_date]

    # MCC-Kategorie zuordnen
    df['category'] = df['mcc'].apply(map_mcc_to_grouping)

    # Apply limit if provided
    if limit is not None:
        return df.head(limit).to_dict(orient="records")
    
    return df.to_dict(orient="records")

@app.get("/api/transactions2")
def read_transactions():
    print(bankingDataframe.shape)
    return bankingDataframe.to_dict(orient="records")

@app.on_event("startup")
def startup_event():
    thread = threading.Thread(target=load_data)
    thread.start()

@app.get("/")
async def root():
    return {"message": "Hello World!"}


load_dotenv()
myApi_key = os.getenv("OPENAI_API_KEY")
class Prompt(BaseModel):
    userPrompt: str

@app.post("/api/generate-chart")
async def generate_chart(prompt: Prompt):
    system_prompt = f"""
You are a data visualization expert. Generate a Vega-Lite JSON chart spec using:
userId, bookingDate, side, amount, currency, type, mcc, and category. 
bookingDate referes to the date that the transaction occured in the yyyy-mm-dd format
side referes to credit(money booked onto the account) or debit (money deducted from the account).
Type is the type of transaction, options are CARD(Use of the TR Debit Card), CARD_ORDER(Ordering of a TR Debit Card), EARNINGS(Dividends, bond coupon payments, etc.),INTEREST, OTHER, PAYIN, PAYOUT, TRADING
Category is the category of spending given as strings. 
Make sure the chart spec filters by the correct time range given in the query. And make the graph interactable and colorful and include a title
The options for spending categories are: Health, Pet food & Veterinary, Restaurants, Groceries, Agriculture, Miscellaneous, Travel & Transportation, Services, Leisure & Entertainment, IT & Electronics, Retail, Education & Books, Finance & Insurance
Respond ONLY with valid Vega-Lite JSON and start with the curly bracket. No explanation and make sure it's JSON parseable. Don't sort by date if none is given in the chart spec

User prompt: "{prompt.userPrompt}"
    """
    client = OpenAI(api_key="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")

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
        ]
    )

    chart_spec_str = response.choices[0].message.content
    print(chart_spec_str)
    try:
        cleaned_response = re.sub(r'```json|```', '', chart_spec_str)
        cleaned_response = json.loads(cleaned_response)
        cleaned_response["data"] = {"values": bankingDataframe.to_dict(orient="records")} 
        print(json.dumps(cleaned_response, indent=2))
        #print(json.dumps(chart_spec, indent=2))

    except json.JSONDecodeError as e:
        print("Failed to parse JSON. Response:", chart_spec_str)
        raise e
        
    return cleaned_response


@app.post("/api/generate-chart-json")
async def generate_chart_json(prompt: Prompt):
    # Define the system prompt for the LLM
    bankingDataframe['group'] = bankingDataframe['mcc'].apply(map_mcc_to_grouping)
    data_str = bankingDataframe[["bookingDate", "amount", "category", "group"]].astype(str).to_string(index=False)
    
    system_prompt = """
You are a data visualization expert and this is your data:
""" + data_str + """
 Generate a JSON file in this structure based on the user prompt:
{
    "id": "<Unique ID of chars, e.g. 'absdfksdfjskfj>",
    "type": "node",
    "name": "What the prompt asks for, e.g. 'Spendings for Pets'",
    "value": <Total value, calculated from all children>,
    "color": "<Hex color code>",
    "children": [
      {
        "type": "node",
        "name": "<Group name>",
        "id": "<Unique ID>",
        "value": <SUM of leaf values>,
        "color": "<Hex color code>",
        "children": [
          {
            "type": "leaf",
            "name": "<Category: value $ (date)>",
            "value": <Leaf value>,
            "id": "<Unique ID>",
            "color": "<Hex color code>"
          }
        ]
      },
      {
        "type": "node",
        "name": "<Other relevant group>",
        "id": "<Unique ID>",
        "value": <SUM of leaf values>,
        "color": "<Hex color code>",
        "children": [
          {
            "type": "leaf",
            "name": "<Category: value $ (date)>",
            "value": <Leaf value>,
            "id": "<Unique ID>",
            "color": "<Hex color code>"
          }
        ]
      }
    ]
  }
}
Make it colorful and try to make nodes in the same branch same color.
Based on the given prompt, extract the most relevant information and search for relevant groups and categories.
Then follow the structure above and generate a JSON file.
Make sure to use the correct data types and formats.
VALID JSON ONLY, NO EXPLANATION, start with a { and end with a }. This is the user prompt:
""" + prompt.userPrompt + """JSON:"""

    # Call the OpenAI API
    client = OpenAI(api_key="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")
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": system_prompt},
        ]
    )

    print(system_prompt)

    # Parse the response
    chart_spec_str = response.choices[0].message.content
    print(chart_spec_str)
    try:
        chart_spec = json.loads(chart_spec_str)
        #print(json.dumps(chart_spec, indent=2))

    except json.JSONDecodeError as e:
        print("Failed to parse JSON. Response:", chart_spec_str)
        raise e
        
    return chart_spec






