import datetime
from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict
from sim_trend import SimulateTrend
from pulse_data_funcs import PulseData
from pydantic import BaseModel, Field
from datetime import datetime

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
    start: datetime = Field(None, description="The start date of the data range")
    end: datetime = Field(None, description="The end date of the data range")


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
    
@app.get("/pulse-last", response_model=List[float])
def get_last(tags: str):
    values = trend.get_last_records(tags)
    return values


def get_dataframe_params(
    tags: str = Query(None, description="Comma-separated list of tags"),
    start: datetime = Query(None, description="Start datetime"),
    end: datetime = Query(None, description="End datetime")
):
    if tags is None:
        tags = "RECOVERY_LINE1_CU_LONG,CUFLOTAS2-S7-400PV_CU_LINE_1,CUFLOTAS2-S7-400PV_FE_LINE1"
    if start is None:
        start = datetime.now() - timedelta(days=10)
    if end is None:
        end = datetime.now()
    return {"tags": tags, "start": start, "end": end}

@app.get("/pulse-ts", response_model=List[TagData])
def get_data(params: dict = Depends(get_dataframe_params)):
    tags_list = params["tags"].split(',')
    tags_data = trend.get_data_by_tags(tags_list, params["start"], params["end"])

    # Convert to list of dicts
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

@app.get("/kde-densities", response_model=str)
def get_kde_densities(tag, sp):
    buf = trend.get_kde_densities(tag, sp)

    return Response(content=buf.getvalue(), media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_pulse:app", host="0.0.0.0", port=8000, reload=True)
