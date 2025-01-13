import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
from matplotlib import pyplot as plt

def gen_synthetic_df():
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 1, 10)
    categories = ["механо", "електро", "технологични", "ппр", "системни"]
    streams = [f"Поток {i}" for i in range(1, 14)]
    machines = ["Питател 1", "Питател 2", "Питател 3", "Питател 4", "Питател 5", "Питател 6", "Дълга лента", "Горно сито", "Къса лента", "Течка", "Трошачка", "Долно сито", "Маслена станция", "ССТ 5", "ПВ 1", "ПВ 2/3", "ССТ 7", "ССТ 8", "ССТ 9", "МБ 1", "МБ 2"]

    # Generate random data
    data = []
    for _ in range(1000):
        start_time = start_date + timedelta(minutes=random.randint(0, int((end_date - start_date).total_seconds() / 60)))
        duration = np.random.poisson(lam=20) + 5  # Poisson distribution with lambda=60, shifted by 5 minutes
        duration = min(max(duration, 5), 180)  # Ensure duration is within the range 5 to 180 minutes
        end_time = start_time + timedelta(minutes=duration)
        category = random.choice(categories)
        stream_name = random.choice(streams)
        machine_name = random.choice(machines)
        data.append([start_time, end_time, duration, category, stream_name, machine_name])

    # Create the dataframe
    df = pd.DataFrame(data, columns=["start_time", "end_time", "duration_minutes", "category", "stream_name", "machine_name"])
    return df   



def group_dataframe_by_stream(df: pd.DataFrame, columns:list[str]) -> pd.DataFrame:

    grouped_df = df.groupby(columns).size().reset_index(name='count')
    return grouped_df

def group_dataframe_by_machine(df: pd.DataFrame, machine_name: str) -> pd.DataFrame:

    filtered_df = df[df['machine_name'] == machine_name]
    total_duration_per_stream = filtered_df.groupby('stream_name')['duration_minutes'].sum().reset_index()
    total_duration_per_stream.columns = ['stream_name', 'total_duration_minutes']
    return total_duration_per_stream

# Example usage:
df = gen_synthetic_df()
grouped_df = group_dataframe_by_stream(df, ["stream_name", "machine_name"])
grouped_df = df.groupby('stream_name')['duration_minutes'].sum().reset_index()
print(grouped_df)

# Filter the dataframe for the specific machine
grp2 = group_dataframe_by_machine(df, "Питател 1")
print(grp2)
