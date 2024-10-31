
from typing import List
import pyodbc 
import json
import numpy as np
import pandas as pd
from  tags_definition import sql_tags

class PulseData:
    def __init__(self):
        server = '10.20.2.10' 
        database = 'pulse' 
        username = 'Pulse_RO' 
        password = 'PD@T@r3@der' 
        cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
        self.cursor = cnxn.cursor()
    
    def get_data_by_tag(self,tag_name: str, counts: int = 10) -> np.ndarray:
        tag_id = next((tag["id"] for tag in sql_tags if tag["name"] == tag_name), None)
        if tag_id is None:
            raise ValueError(f"Tag '{tag_name}' not found.")
        
        query_str = f"select top {counts} IndexTime, LoggerTagID, Value from \
            LoggerValues where LoggerTagID = {tag_id} order by IndexTime desc"
        self.cursor.execute(query_str)
        rows = self.cursor.fetchall()
        
        values = np.array([float(row[2]) for row in rows])
        return values
    
    def get_data_by_tags(self,tag_names: list, counts: int = 10) -> np.ndarray:
        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
        if any(id is None for id in tag_ids):
            raise ValueError("One or more tags not found.")
        
        values = []
        for tag_id in tag_ids:
            query_str = f"select top {counts} IndexTime, LoggerTagID, Value from LoggerValues where LoggerTagID = {tag_id} order by IndexTime desc"
            self.cursor.execute(query_str)
            rows = self.cursor.fetchall()
            values.append(np.array([float(row[2]) for row in rows]))
        
        return np.array(values)
    
    
    def get_data_with_timestamps(self, tag_names: list, counts: int = 10) -> List[dict]:
        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
        if any(id is None for id in tag_ids):
            raise ValueError("One or more tags not found.")
        
        data = []
        for tag_id in tag_ids:
            query_str = f"SELECT TOP {counts} IndexTime, LoggerTagID, Value FROM LoggerValues WHERE LoggerTagID = {tag_id} ORDER BY IndexTime DESC"
            self.cursor.execute(query_str)
            rows = self.cursor.fetchall()
            rows = [list(row) for row in rows]

            # Create a pandas DataFrame from the query result
            df = pd.DataFrame(rows, columns=['IndexTime', 'LoggerTagID', 'Value'])
            df = df[df['Value'] > 0]
            df['Timestamp'] = pd.to_datetime(df['IndexTime'])
            
            df.set_index('Timestamp', inplace=True)
            df['Value'] = pd.to_numeric(df['Value'])
            
            df_resampled = df.resample('1h').mean().interpolate(method='linear')
            df_resampled['Tagname'] = df_resampled['LoggerTagID'].apply(lambda x: next((tag["name"] for tag in sql_tags if tag["id"] == x), None))
            df_resampled.reset_index(inplace=True)
            df_resampled.drop('IndexTime', axis=1, inplace=True)

            df_resampled = df_resampled.rename(columns={
                    'Timestamp': 'timestamp',
                    'LoggerTagID': 'tag_id',
                    'Value': 'value',
                    'Tagname': 'tagname'
                })
            df_resampled['timestamp'] = df_resampled['timestamp'].dt.strftime("%Y-%m-%d %H:%M")

            
            print(df_resampled.describe())

            data.extend(df_resampled.to_dict(orient='records'))

        return data
    
   