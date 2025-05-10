from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from datetime import datetime
import json
import iso18245  # MCC mapping library

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
async def root():
    return {"message": "Hello World!"}


