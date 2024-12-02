import datetime
import io
from typing import List, Optional
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
from datetime import datetime as dt, timedelta
from sqlalchemy import create_engine, text
from tags_definition import mills_tags





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
        result_dict["title"] = mill

        return result_dict

    
