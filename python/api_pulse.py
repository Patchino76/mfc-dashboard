from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict
from sim_trend import SimulateTrend
from pulse_data_funcs import PulseData
from pydantic import BaseModel, Field   
from pydantic import BaseModel, Field   
from datetime import datetime as dt

app = FastAPI()
origins = ["http://localhost:3000", "https://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trend_sim = SimulateTrend()
trend = PulseData()

class QueryParams(BaseModel):
    tags: str = Field(..., description="The tags to filter data by")
    # tags: List[str] = Field(..., description="The tags to filter data by")
    start: dt = Field(None, description="The start date of the data range")
    end: dt = Field(None, description="The end date of the data range")


class TagData(BaseModel):
    timestamp: str
    data: Dict[str, float]

@app.options("/{path:path}")
async def preflight_handler():
    return {"message": "Preflight request handled"}

@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS is working"}

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
#simulation
@app.get("/trend2", response_model=List[float])
def get_trend():
    data = trend_sim.simulate_trend()
    return data
#simulation
@app.get("/trend_pv_sp", response_model=Dict[str,List[float]])
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
    
@app.get("/pulse-last", response_model=List[float])
def get_last(tags: str):
    values = trend.get_last_records(tags)
    return values


@app.get("/pulse-ts", response_model=List[TagData])
def get_data(params: QueryParams = Depends()):

    tags_list = params.tags.split(',')
    tags_data = trend.get_data_by_tags(tags_list, params.start, params.end)

    # convert to list of dicts
    response_list = [{'timestamp': k, 'data': v} for k, v in tags_data.items()]

    return response_list


@app.get("/scatter", response_model=str)
def get_scatter():
    data = trend.get_scatter()
    return data

@app.get("/image", response_model=str)
def get_image():
    buf = trend.get_image()

    return Response(content=buf.getvalue(), media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_pulse:app", host="0.0.0.0", port=8000, reload=True)
