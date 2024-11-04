from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict
from pydantic import BaseModel, Field   
import pandas as pd
import datetime
import numpy as np


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

class QueryParams(BaseModel):
    tags: str = Field(..., description="The tags to filter data by")
    num_records: int = Field(10, description="Number of records to return")

class TagData(BaseModel):
    tag_id: int
    tagname: str
    timestamp: str
    value: float

   

def make_df_from_tags_and_dates_fake(tag_names: list, start: datetime.datetime, end: datetime.datetime) -> pd.DataFrame:
    start_date = start
    end_date = end

    # date_range = pd.date_range(start='2024-01-01', end='2024-01-31', freq='H')
    date_range = pd.date_range(start, end, freq='1h')

    # Generate random data around the specified values
    np.random.seed(0)  # For reproducibility
    tag1 = np.random.normal(loc=88, scale=1, size=len(date_range))
    tag2 = np.random.normal(loc=0.035, scale=0.005, size=len(date_range))
    tag3 = np.random.normal(loc=2.5, scale=0.1, size=len(date_range))

    # Create the DataFrame
    df = pd.DataFrame({
        'RECOVERY_LINE1_CU_LONG': tag1,
        'CUFLOTAS2-S7-400PV_CU_LINE_1': tag2,
        'CUFLOTAS2-S7-400PV_FE_LINE1': tag3
    }, index=date_range)
    return df

def get_data_with_timestamps(tag_names: list, counts: int = 10) -> List[dict]:
    print(tag_names)
    df = make_df_from_tags_and_dates_fake(tag_names, start=datetime.datetime(2024, 11, 1, 6, 0), end=datetime.datetime.now())
    
    # df['timestamp'] = df['timestamp'].astype(str) #.dt.strftime("%Y-%m-%d %H:%M")
    # rez = df.to_dict(orient='index')
    rez = {index.strftime('%Y-%m-%d %H:%M:%S'): row.to_dict() for index, row in df.iterrows()}
    print(df.head(2))
    print(rez)
    return rez


@app.get("/pulse-ts", response_model=List[TagData])
def get_data_by_tags_and_ts(params: QueryParams = Depends()):
    try:
        tags_list = params.tags.split(',')
        tags_data = get_data_with_timestamps(tags_list, params.num_records)
        return tags_data
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@app.get("/pulse-ts2", response_model=Dict[str, Dict[str, float]])
def get_data_by_tags_and_ts2(params: QueryParams = Depends()):
    try:
        tags_list = params.tags.split(',')
        tags_data = get_data_with_timestamps(tags_list, params.num_records)
        return tags_data
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_pulse_sim:app", host="localhost", port=8000, reload=True)
