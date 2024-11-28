import datetime
import io
from typing import List, Optional
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
from  tags_definition import sql_tags
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
from datetime import datetime as dt, timedelta
from sqlalchemy import create_engine, text
from data_utils import clean_array_outliers, clean_df_outliers

matplotlib.use('Agg')
pd.set_option('future.no_silent_downcasting', True)

sst_tags = [
# ФЛОТАЦИЯ ИЗВЛИЧАНЕ
    {"id": 832, "name" : "SST_FB_LONG_BELT_STR2", "desc" : "Дълга лента 2" },
    {"id": 854, "name" : "SST_CB_KUBRIA_ON_STR2", "desc" : "Кубрия 2" },
]

class SstDowntimes(BaseModel):
    tags: Optional[str]  = None 
    start: Optional[str] = None
    end: Optional[str] = None
    clean_array_outliers = staticmethod(clean_array_outliers)
    clean_df_outliers = staticmethod(clean_df_outliers)
    class Config:
        arbitrary_types_allowed = True
    def __init__(self, **data):
        
        super().__init__(**data)
        self.tags = "RECOVERY_LINE1_CU_LONG,CUFLOTAS2-S7-400PV_CU_LINE_1,CUFLOTAS2-S7-400PV_FE_LINE1"
        self.start = (datetime.datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d %H:%M:%S")
        self.end = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._df = None

        print("start value after init:", self.start)
        print("end value after init:", self.end)
    # def __init__(self, **data):
    #     super().__init__(**data)
    #     self._df = None

    def __call__(self, tags: Optional[str] = None, start: Optional[str] = None, end: Optional[str] = None):
        self.tags = tags or "RECOVERY_LINE1_CU_LONG,CUFLOTAS2-S7-400PV_CU_LINE_1,CUFLOTAS2-S7-400PV_FE_LINE1"
        self.start = start or (datetime.datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        self.end = end or datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print("start value after call:", self.start)
        print("end value after call:", self.end)
        return self
    @property
    def df(self):
        if self._df is None:
            self.fetch_data()
        return self._df
    @df.setter
    def df(self, value):
        self._df = value
        

    def sql_connect(self):
        server = '10.20.2.10' 
        database = 'pulse' 
        username = 'Pulse_RO' 
        password = 'PD@T@r3@der' 
        connection_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}"
        return create_engine("mssql+pyodbc:///?odbc_connect=" + connection_string)

    def fetch_data(self):
        engine = self.sql_connect()
        tags_as_list = self.tags.split(',')
        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tags_as_list]

        query_str = f"SELECT IndexTime, LoggerTagID, Value FROM LoggerValues WHERE LoggerTagID IN ({', '.join(map(str, tag_ids))}) \
                AND IndexTime BETWEEN '{self.start}' AND '{self.end}' ORDER BY IndexTime ASC"

        with engine.connect() as connection:
            df = pd.read_sql(query_str, connection)
        
            df['timestamp'] = pd.to_datetime(df['IndexTime'])
            df = df.drop_duplicates()
            df.set_index('timestamp', inplace=True)
            df.drop('IndexTime', axis=1, inplace=True)
            

            tag_dict = {tag['id']: tag['name'] for tag in sql_tags}
            df_pivoted = df.pivot(columns='LoggerTagID', values='Value')
            df_pivoted.columns = [tag_dict[col] for col in df_pivoted.columns]
            df_pivoted = clean_df_outliers(df_pivoted, threshold=4)
            df_pivoted = df_pivoted.resample('1h').mean()
            df_pivoted = df_pivoted.ffill().infer_objects(copy=False)
            df_pivoted = df_pivoted.iloc[::-1]  # reverse the dataframe
            df_pivoted.dropna(inplace=True, how='any')
            self.df = df_pivoted
          
            return df_pivoted