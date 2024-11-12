from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict
from api_dependances import ApiDependancies
from pydantic import BaseModel, Field
from datetime import datetime, timedelta

app = FastAPI()
origins = ["http://localhost:3000", "https://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# trend = PulseData()

# class QueryParams(BaseModel):
#     tags: str = Field(..., description="The tags to filter data by")
#     # tags: List[str] = Field(..., description="The tags to filter data by")
#     start: datetime = Field(None, description="The start date of the data range")
#     end: datetime = Field(None, description="The end date of the data range")

# class QueryParams2(BaseModel):
#     tags: str = "RECOVERY_LINE1_CU_LONG,CUFLOTAS2-S7-400PV_CU_LINE_1,CUFLOTAS2-S7-400PV_FE_LINE1"
#     start: datetime = datetime.now() - timedelta(days=10)
#     end: datetime = datetime.now()


class TagData(BaseModel):
    timestamp: str
    data: Dict[str, float]

@app.get("/pulse-last", response_model=List[float])
def get_last(commons: ApiDependancies = Depends()):
    last_values = commons.fetch_last_records()
    return last_values

@app.get("/pulse-ts", response_model=List[TagData])
def get_data(commons: ApiDependancies = Depends()):
    print("commons", commons.tags, commons.start, commons.end)
    df = commons.fetch_data()
    df = df.iloc[::-1]  # reverse the dataframe
    df_to_dict = {index.strftime("%Y-%m-%d %H:%M"): row.to_dict() for index, row in df.iterrows()}

    # Convert to list of dicts
    response_list = [{'timestamp': k, 'data': v} for k, v in df_to_dict.items()]
    return response_list


@app.get("/reg", response_model=str)
def get_image(commons: ApiDependancies = Depends()):
    buf = commons.get_reg_plot()
    return Response(content=buf.getvalue(), media_type="image/png")

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/kde", response_model=str)
def get_kde_densities(commons: ApiDependancies = Depends(), sp: float = 88.5):
    buf = commons.get_kde_plot()

    return Response(content=buf.getvalue(), media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_pulse:app", host="0.0.0.0", port=8000, reload=True)
