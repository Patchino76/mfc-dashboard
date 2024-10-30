from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict
from sim_trend import SimulateTrend
from pulse_data_funcs import PulseData
from pydantic import BaseModel, Field   

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

trend_sim = SimulateTrend()
trend = PulseData()

class QueryParams(BaseModel):
    tags: str = Field(..., description="The tags to filter data by")
    num_records: int = Field(10, description="Number of records to return")

class TagData(BaseModel):
    tag_id: int
    tagname: str
    timestamp: str
    value: float

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
#simulation
@app.get("/trend2", response_model=List[float])
def get_trend():
    data = trend_sim.simulate_trend()
    return data
#simulation
@app.get("/trend_pv_sp_aa", response_model=Dict[str,List[float]])
def get_trend_sp_pv():
    data = trend_sim.simulate_pv_and_sp()
    return data

#pulse sql data
@app.get("/pulse", response_model=List[List[float]])
def get_data(params: QueryParams = Depends()):
    try:
        tags_list = params.tags.split(',')
        tags_data = trend.get_data_by_tags(tags_list, params.num_records)
        # tags_data = tags_data.tolist()
        return tags_data
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/pulse-ts", response_model=List[TagData])
def get_data(params: QueryParams = Depends()):
    try:
        tags_list = params.tags.split(',')
        tags_data = trend.get_data_with_timestamps(tags_list, params.num_records)
        return tags_data
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_pulse:app", host="localhost", port=8000, reload=True)
