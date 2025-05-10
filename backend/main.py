from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import iso18245
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import threading

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
        sliced_df['category'] = sliced_df['mcc'].apply(map_mcc_to_category)

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

def map_mcc_to_category(mcc_code):
    try:
        mcc_obj = iso18245.get_mcc(str(int(mcc_code)))
        return (
            mcc_obj.visa_description
            or mcc_obj.stripe_description
            or mcc_obj.iso_description
            or "Unknown"
        )
    except Exception:
        return "Unknown"


@app.get("/api/transactions")
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
Make sure the chart spec filters by the correct time range given in the query. And make the graph interactable
Respond ONLY with valid Vega-Lite JSON and start with the curly bracket. No explanation and make sure it's JSON parseable

User prompt: "{prompt.userPrompt}"
    """
    client = OpenAI(api_key="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")

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
        ]
    )

    chart_spec_str = response.choices[0].message.content
    print(chart_spec_str)
    try:
        chart_spec = json.loads(chart_spec_str)
        chart_spec["data"] = {"values": bankingDataframe.to_dict(orient="records")} 
        #print(json.dumps(chart_spec, indent=2))

    except json.JSONDecodeError as e:
        print("Failed to parse JSON. Response:", chart_spec_str)
        raise e
        
    return chart_spec


