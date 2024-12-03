import datetime
import io
from typing import List, Optional
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
from datetime import datetime as dt, timedelta
from sqlalchemy import create_engine, text
from tags_definition import mills_tags, mills_dict
import random

class MillsUtils(BaseModel):
    tag: Optional[str]  = None 
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



    def fetch_ore_totals_by_mill(self, mill: str) -> dict:
        engine = self.sql_connect()
        
        # Get all tag IDs for the specified mill from each shift
        result_dict = {}
        for shift_key in mills_tags.keys():
            mill_tag = next((tag for tag in mills_tags[shift_key] if tag["name"] == mill), None)
            if mill_tag:
                tag_id = mill_tag["id"]
                
                query_str = f"""
                WITH LastRecords AS (
                    SELECT Value, LoggerTagID,
                    ROW_NUMBER() OVER (PARTITION BY LoggerTagID ORDER BY IndexTime DESC) as rn
                    FROM LoggerValues
                    WHERE LoggerTagID = {tag_id}
                )
                SELECT Value
                FROM LastRecords
                WHERE rn = 1
                """
                
                with engine.connect() as connection:
                    df = pd.read_sql(query_str, connection)
                    if not df.empty:
                        result_dict[shift_key] = float(df['Value'].iloc[0])
                    else:
                        result_dict[shift_key] = 0.0

        result_dict['state'] = True if result_dict['ore'] >= 10 else False
        mill_bg_title = next((item["bg"] for item in mills_dict if item["en"] == mill), None)
        print(mill_bg_title)
        result_dict["title"] = mill_bg_title



        return result_dict

    def fetch_trend_by_tag(self, mill: str, tag: str, trendPoints: int):
        # Find the tag ID for the given mill from ore list
        mill_tag = next((item for item in mills_tags[tag] if item["name"] == mill), None)
        if mill_tag is None:
            return []
            
        tag_id = mill_tag["id"]
        
        query_str = f"select top {trendPoints} DATEADD(hour, 3, IndexTime) as IndexTime, Value from LoggerValues where LoggerTagID = {tag_id} order by IndexTime desc"
        with self.sql_connect().connect() as connection:
            df = pd.read_sql(query_str, connection)
            df['timestamp'] = pd.to_datetime(df['IndexTime'])
            df = df.drop_duplicates()
            df.set_index('timestamp', inplace=True)
            df.drop('IndexTime', axis=1, inplace=True)
            df = df.resample('15min').mean()
            return df

    def fetch_all_mills_by_parameter(self, parameter: str = "ore"):
        rows = mills_tags[parameter]
        tags_id = [row["id"] for row in rows]
        print(tags_id)
        # Create CASE statement for ordering
        order_case = " ".join([f"WHEN {tag_id} THEN {i}" for i, tag_id in enumerate(tags_id)])
        
        query_str = """
            WITH LastValues AS (
                SELECT 
                    LoggerTagID,
                    Value,
                    ROW_NUMBER() OVER (PARTITION BY LoggerTagID ORDER BY IndexTime DESC) as rn
                FROM LoggerValues 
                WHERE LoggerTagID IN ({})
            )
            SELECT LoggerTagID, Value 
            FROM LastValues 
            WHERE rn = 1
            ORDER BY CASE LoggerTagID {}
            END
        """.format(', '.join(map(str, tags_id)), order_case)
        
        with self.sql_connect().connect() as connection:
            df = pd.read_sql(query_str, connection)
            mills_bg = [item["bg"] for item in mills_dict]
            print(mills_bg)
            values = df['Value'].tolist()
            print(values)
            res_dict = [{"mill": mill, "value": value} for mill, value in zip(mills_bg, values)]
            return res_dict