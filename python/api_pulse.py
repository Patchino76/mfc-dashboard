from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from sim_trend import SimulateTrend
from pulse_data_funcs import PulseData

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
def get_data(tags: List[str] = Query(..., description="The tags to filter data by"), num_records: int = Query(10, description="Number of records to return")):
    print(tags, num_records)
    tags_data = trend.get_data_by_tags(tags, num_records)
    tags_data = tags_data.tolist()
    
    return tags_data


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_pulse:app", host="localhost", port=8000, reload=True)
