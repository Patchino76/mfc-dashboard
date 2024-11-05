
import datetime
from typing import List
import pyodbc 
import numpy as np
import pandas as pd
from  tags_definition import sql_tags
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
import mpld3
from datetime import datetime as dt
import threading

matplotlib.use('Agg')
pd.set_option('future.no_silent_downcasting', True)

class PulseData:
    # df = pd.DataFrame()
    # fig = None
    # ax = None
    def __init__(self):
        server = '10.20.2.10' 
        database = 'pulse' 
        username = 'Pulse_RO' 
        password = 'PD@T@r3@der' 
        cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
        self.cursor = cnxn.cursor()
        self.df = pd.DataFrame()
        self.fig, self.ax = plt.subplots()

    
    def get_data_by_tag(self,tag_name: list, counts: int = 10) -> np.ndarray:
        tag_id = next((tag["id"] for tag in sql_tags if tag["name"] == tag_name), None)
        if tag_id is None:
            raise ValueError(f"Tag '{tag_name}' not found.")
        
        query_str = f"select top {counts} IndexTime, LoggerTagID, Value from \
            LoggerValues where LoggerTagID = {tag_id} order by IndexTime desc"
        self.cursor.execute(query_str)
        rows = self.cursor.fetchall()
        
        values = np.array([float(row[2]) for row in rows])
        return values
    
    def get_last_records(self, tags: str) -> List[float]:
        tag_names = [x.strip() for x in tags.split(',')]

        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
        
        values = []
        for tag_id in tag_ids:
            query_str = f"select top 1 Value from LoggerValues where LoggerTagID = {tag_id} order by IndexTime desc"
            self.cursor.execute(query_str)
            rows = self.cursor.fetchall()

            if rows:  # Check if rows is not empty
                # print(rows)
                values.append(float(rows[0][0]))
        print(values)
        return values

    
    def clean_df_outliers(self, df, columns=None, threshold=3):

        if columns is None:
            columns = df.columns
        
        for column in columns:
            if pd.api.types.is_numeric_dtype(df[column]):
                mean = df[column].mean()
                std = df[column].std()
                outliers = (df[column] - mean).abs() > threshold * std
                df.loc[outliers, column] = mean
        return df

   
    def get_data_by_tags(self, tag_names: list, start: dt, end: dt) -> dict:
        start = start.replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S")
        end = end.replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S")

        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]

        data = []
        for tag_id in tag_ids:
            query_str = f"SELECT  IndexTime, Value FROM LoggerValues WHERE LoggerTagID = {tag_id} \
                AND IndexTime BETWEEN '{start}' AND '{end}' ORDER BY IndexTime DESC"
            self.cursor.execute(query_str)
            rows = self.cursor.fetchall()
            rows = [list(row) for row in rows]

            tag_name = next((tag["name"] for tag in sql_tags if tag["id"] == tag_id), None)
            data.append({"tagname": tag_name, "df": pd.DataFrame(rows, columns=['timestamp', 'value'])})

        for item in data: #setting the dt index
            item['df']['timestamp'] = pd.to_datetime(item['df']['timestamp'])
            item['df'].set_index('timestamp', inplace=True)

            # item["df"] = self.clean_df_outliers(df=item["df"])
            item['df'] = item['df'].resample('1h').mean()


        # Find the common indices in the dataframes and trim to the common ones
        common_indices = data[0]['df'].index
        for item in data[1:]:
            common_indices = common_indices.intersection(item['df'].index)
        for item in data:
            item['df'] = item['df'].loc[common_indices]

        df = pd.concat([item['df'].rename(columns={'value': item['tagname']}) for item in data], axis=1)

        
        df = df.ffill().infer_objects(copy=False)
        df = self.clean_df_outliers(df)
        df_to_dict = {index.strftime("%Y-%m-%d %H:%M"): row.to_dict() for index, row in df.iterrows()}

        self.df = df
        return df_to_dict
            

    # MPLD3 version 0.5.10 is working so install it from pip
    def get_scatter(self, tag1: str="X", tag2: str="Y") -> str:
        if self.df.shape == (0,0):
            print("No data available")
            return "No data available"
        print(self.df.head(2))
        tag1 = 'CUFLOTAS2-S7-400PV_CU_LINE_1'
        tag2 = 'CUFLOTAS2-S7-400PV_FE_LINE1'
        desc1 = next((tag for tag in sql_tags if tag["name"] == tag1), None)["desc"]
        desc2 = next((tag for tag in sql_tags if tag["name"] == tag2), None)["desc"]
        title = "Диаграма на разпърскване"
     
        values1 = self.df[tag1].values
        values2 = self.df[tag2].values
 
        sns.regplot(self.df, x=tag1, y=tag2, ax=self.ax)
        self.ax.set_title(title)
        self.ax.set_xlabel(desc1)
        self.ax.set_ylabel(desc2)

        html = mpld3.fig_to_html(self.fig)
        print(next((tag for tag in sql_tags if tag["name"] == tag1), None)["desc"])
        return html


    
   