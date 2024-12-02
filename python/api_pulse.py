from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, List, Dict
from api_dependances import ApiDependancies
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from sst_downtimes.sst_downtimes import SstDowntimes
from mills.mills_api_utils import MillsUtils


app = FastAPI()
origins = ["http://localhost:3000", "https://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class TagData(BaseModel):
    timestamp: str
    data: Dict[str, float]

@app.get("/pulse-last", response_model=List[float])
def get_last(commons: ApiDependancies = Depends()):
    last_values = commons.fetch_last_records()
    return last_values

@app.get("/pulse-ts", response_model=List[TagData])
def get_data(commons: ApiDependancies = Depends()):
    # print("endpoint ts called with commons", commons)
    df = commons.fetch_data()
    df_to_dict = {index.strftime("%Y-%m-%d %H:%M"): row.to_dict() for index, row in df.iterrows()}

    # Convert to list of dicts
    response_list = [{'timestamp': k, 'data': v} for k, v in df_to_dict.items()]
    return response_list


@app.get("/reg", response_model=str)              #here tags must have only 2 tags
def get_reg_plot(commons: ApiDependancies = Depends()): 
    # print("endpoint reg called with commons", commons)
    tags = commons.tags.split(",")
    tag1, tag2 = tags
    buf = commons.get_reg_plot(tag1, tag2)
    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/kde", response_model=str)               # here tags must have only 1 tag
def get_kde_densities(commons: ApiDependancies = Depends()):
    print("endpoint kde called with commons", commons)
    buf = commons.get_kde_plot(commons.tags, commons.sp)

    return Response(content=buf.getvalue(), media_type="image/png")

@app.get('/sst-downtimes')
def get_sst_downtimes(commos : SstDowntimes = Depends(), response_model=List[List[str]]):
    print("endpoint sst-downtimes called with commons", commos)
    df = commos.calculate_downtimes(commos.tag, commos.start, commos.end) 
    df_to_list = df.values.tolist()
    for row in df_to_list:
        row[0] = row[0].strftime("%Y-%m-%d %H:%M:%S")
        row[1] = row[1].strftime("%Y-%m-%d %H:%M:%S")
    print(df_to_list)
    return df_to_list

@app.get('/ore-by-mill')
def get_ore_by_mill(mill:str, response_model=Dict[str, Any]): 
    ore = MillsUtils()
    tags = ore.fetch_ore_totals_by_mill(mill)
    return tags

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_pulse:app", host="0.0.0.0", port=8000, reload=True)
