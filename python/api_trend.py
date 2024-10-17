from fastapi import FastAPI
from typing import List, Dict

from sim_trend import SimulateTrend

app = FastAPI()
trend = SimulateTrend()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/trend", response_model=Dict[str, List[float]])
def get_trend():
    data = trend.simulate_trend()
    return {"data": data}

@app.get("/last_value", response_model=Dict[str, float])
def get_last_value():
    data = trend.get_last_price()
    return {"data": data}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_trend:app", host="localhost", port=8000, reload=True)
