from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from sim_trend import SimulateTrend

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trend = SimulateTrend()

@app.get("/test")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/trend", response_model=List[float])
def get_trend():
    data = trend.simulate_trend()
    return data

@app.get("/trend_pv_sp", response_model=Dict[str,List[float]])
def get_trend_sp_pv():
    data = trend.simulate_pv_and_sp()
    return data


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_trend:app", host="localhost", port=8000, reload=True)
