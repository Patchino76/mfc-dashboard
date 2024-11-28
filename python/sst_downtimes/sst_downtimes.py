import datetime
import io
from typing import List, Optional
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
from datetime import datetime as dt, timedelta
from sqlalchemy import create_engine, text

matplotlib.use('Agg')
pd.set_option('future.no_silent_downcasting', True)

sst_tags = [
    {"id": 832, "name" : "SST_FB_LONG_BELT_STR2", "desc" : "Дълга лента 2" },
    {"id": 854, "name" : "SST_CB_KUBRIA_ON_STR2", "desc" : "Кубрия 2" },
]

class SstDowntimes(BaseModel):
    tags: Optional[str]  = None 
    start: Optional[str] = None
    end: Optional[str] = None
    class Config:
        arbitrary_types_allowed = True
    def __init__(self, **data):      
        super().__init__(**data)

    def sql_connect(self):
        server = '10.20.2.10' 
        database = 'pulse' 
        username = 'Pulse_RO' 
        password = 'PD@T@r3@der' 
        connection_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}"
        return create_engine("mssql+pyodbc:///?odbc_connect=" + connection_string)

    def fetch_data_by_tag(self, tag_name: str, start: str, end: str):
        engine = self.sql_connect()

        tag_id  = next((tag["id"] for tag in sst_tags if tag["name"] == tag_name), None)
        print(tag_id)
        query_str = f"""
            SELECT IndexTime, LoggerTagID, Value 
            FROM LoggerValues 
            WHERE LoggerTagID = {str(tag_id)}
            AND IndexTime BETWEEN '{start}' AND '{end}' 
            ORDER BY IndexTime DESC
        """
        
        with engine.connect() as connection:
            df = pd.read_sql(query_str, connection)
            df['timestamp'] = pd.to_datetime(df['IndexTime'])
            df = df.drop_duplicates()
            # print(df)
            return df

    def calculate_downtimes(self, tag_name: str, start: str, end: str) -> pd.DataFrame:
        """
        Calculate downtime periods for a specific tag.
        Returns DataFrame with columns: start_time, end_time, duration_minutes
        """
        df = self.fetch_data_by_tag(tag_name=tag_name, start=start, end=end)
            
        
        # Sort by timestamp
        df = df.sort_values('timestamp')
        
        # Initialize lists to store downtime periods
        start_times = []
        end_times = []
        
        # Track state
        current_start = None
        previous_value = None
        
        # Iterate through the data
        for _, row in df.iterrows():
            current_value = row['Value']
            
            # Start of downtime (transition from 0 to 1)
            if previous_value == 0 and current_value == 1:
                current_start = row['timestamp']
            
            # End of downtime (transition from 1 to 0)
            elif previous_value == 1 and current_value == 0 and current_start is not None:
                start_times.append(current_start)
                end_times.append(row['timestamp'])
                current_start = None
            
            previous_value = current_value
        
        # Create downtime periods DataFrame
        if start_times:
            downtimes_df = pd.DataFrame({
                'start_time': start_times,
                'end_time': end_times
            })
            
            # Calculate duration in minutes
            downtimes_df['duration_minutes'] = (
                (downtimes_df['end_time'] - downtimes_df['start_time'])
                .dt.total_seconds() / 60
            ).round()
            
            return downtimes_df
        
        return pd.DataFrame(columns=['start_time', 'end_time', 'duration_minutes'])
