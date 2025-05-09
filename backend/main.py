from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/transactions")
def read_transactions():
    df = pd.read_csv("./data/banking_sample_data.csv")
    df = df.replace([float('inf'), float('-inf')], None).fillna('')
    # print(df.to_dict(orient="records"))
    return df.to_dict(orient="records")

@app.get("/")
async def root():
    return {"message": "Hello World!"}


