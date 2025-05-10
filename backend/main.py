from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import iso18245
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import json


app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    cwd = os.getcwd()
    df = pd.read_csv(cwd + "/data/banking_sample_data.csv")
    sliced_df = df.iloc[310:370]
    sliced_df = sliced_df.replace([float('inf'), float('-inf')], None).fillna('')
    sliced_df['side'] = sliced_df['side'].str.strip().str.lower()
    sliced_df['category'] = sliced_df['mcc'].apply(map_mcc_to_category)
    print(sliced_df)
    return sliced_df.to_dict(orient="records")

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
side referes to credit(money booked onto the account) or debit (money deducted from the account).
Type is the type of transaction, options are CARD(Use of the TR Debit Card), CARD_ORDER(Ordering of a TR Debit Card), EARNINGS(Dividends, bond coupon payments, etc.),INTEREST, OTHER, PAYIN, PAYOUT, TRADING
Category is the category of spending given as strings. 
If no year is given assume it's 2025.

Respond ONLY with valid Vega-Lite JSON. No explanation and make sure it's JSON parseable

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

    try:
        chart_spec = json.loads(chart_spec_str)
        chart_spec["data"] = {"values": read_transactions()} 
        print(json.dumps(chart_spec, indent=2))

    except json.JSONDecodeError as e:
        print("Failed to parse JSON. Response:", chart_spec_str)
        raise e
        
    return chart_spec


