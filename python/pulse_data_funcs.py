
import datetime
from typing import List
import pyodbc 
import numpy as np
import pandas as pd
from  tags_definition import sql_tags
import matplotlib.pyplot as plt
import seaborn as sns
import mpld3

class PulseData:
    df = pd.DataFrame()
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
    
    def make_df_from_tags_and_dates(self, tag_names: list, start: datetime.datetime, end: datetime.datetime) -> pd.DataFrame:
        start_date = start
        end_date = end

        tag_names = ["RECOVERY_LINE1_CU_LONG",     "CUFLOTAS2-S7-400PV_CU_LINE_1",     "CUFLOTAS2-S7-400PV_FE_LINE1"]
        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]

        data = []
        for tag_id in tag_ids:
            query_str = f"SELECT TOP {300} IndexTime, Value FROM LoggerValues WHERE LoggerTagID = {tag_id} ORDER BY IndexTime DESC"
            self.cursor.execute(query_str)
            rows = self.cursor.fetchall()
            rows = [list(row) for row in rows]

        tag_name = next((tag["name"] for tag in sql_tags if tag["id"] == tag_id), None)
        data.append({"tagname": tag_name, "df": pd.DataFrame(rows, columns=['timestamp', 'value'])})

        for item in data: #setting the dt index
            item['df']['timestamp'] = pd.to_datetime(item['df']['timestamp'])
            item['df'].set_index('timestamp', inplace=True)

        for item in data:
            item['df'] = item['df'].loc[end_date:start_date].resample('1h').mean()

        # Find the common indices in the dataframes and trim to the common ones
        common_indices = data[0]['df'].index
        for item in data[1:]:
            common_indices = common_indices.intersection(item['df'].index)
        for item in data:
            item['df'] = item['df'].loc[common_indices]

        result = pd.concat([item['df'].rename(columns={'value': item['tagname']}) for item in data], axis=1)
        # result = result.ffill()
        return result
            

   
    # def get_data_with_timestamps_(self, tag_names: list, counts: int = 10) -> List[dict]:
    #     tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
    #     if any(id is None for id in tag_ids):
    #         raise ValueError("One or more tags not found.")
        
    #     data = []
    #     # self.pd = pd.DataFrame()
    #     for tag_id in tag_ids:
    #         query_str = f"SELECT TOP {counts} IndexTime, LoggerTagID, Value FROM LoggerValues WHERE LoggerTagID = {tag_id} ORDER BY IndexTime DESC"
    #         self.cursor.execute(query_str)
    #         rows = self.cursor.fetchall()
    #         rows = [list(row) for row in rows]

    #         # Create a pandas DataFrame from the query result
    #         df = pd.DataFrame(rows, columns=['IndexTime', 'LoggerTagID', 'Value'])
    #         df = df[df['Value'] > 0]
    #         df['Timestamp'] = pd.to_datetime(df['IndexTime'])
            
    #         df.set_index('Timestamp', inplace=True)
    #         df['Value'] = pd.to_numeric(df['Value'])
            
    #         df_resampled = df.resample('1h').mean().interpolate(method='linear')
    #         df_resampled['Tagname'] = df_resampled['LoggerTagID'].apply(lambda x: next((tag["name"] for tag in sql_tags if tag["id"] == x), None))
    #         df_resampled.reset_index(inplace=True)
    #         df_resampled.drop('IndexTime', axis=1, inplace=True)

    #         df_resampled = df_resampled.rename(columns={
    #                 'Timestamp': 'timestamp',
    #                 'LoggerTagID': 'tag_id',
    #                 'Value': 'value',
    #                 'Tagname': 'tagname'
    #             })
    #         df_resampled['timestamp'] = df_resampled['timestamp'].dt.strftime("%Y-%m-%d %H:%M")

    #         print(self.df.shape)
    #         self.df = pd.concat([self.df, df_resampled], ignore_index=True)
            
            

    #         data.extend(df_resampled.to_dict(orient='records'))
    #     print(self.df)
    #     print(self.df.info())
    #     return data
    





    def get_data_with_timestamps(self, tag_names: list, counts: int = 10) -> List[dict]:
        df = self.make_df_from_tags_and_dates(tag_names, start=datetime.datetime(2024, 10, 28, 6, 0), end=datetime.datetime.now())
        # df['timestamp'] = df['timestamp'].dt.strftime("%Y-%m-%d %H:%M")
        rez = df.to_dict(orient='records')
        print(df.head())
        # print(rez)
        return [{}]












    def get_scatter(self, tag1: str="X", tag2: str="Y") -> str:
        if self.df is None:
            print("No data available")
            return
        fig, ax = plt.subplots()
     
        values1 = self.df[self.df['tagname'] == 'CUFLOTAS2-S7-400PV_CU_LINE_1']['value']
        values2 = self.df[self.df['tagname'] == 'CUFLOTAS2-S7-400PV_FE_LINE1']['value']
        # print(values1.shape)
        # print(values2.shape)
        # data = np.column_stack((values1, values2))

        # print("Values1", values1)
        # print("Values2", values2)

        # sns.scatterplot(data, ax=ax)
        ax.set_title(f"{tag1} vs {tag2}")
        ax.set_xlabel(tag1)
        ax.set_ylabel(tag2)

        html = mpld3.fig_to_html(fig)
        plt.savefig("public/images/fig.jpg", format="jpg")
        with open('public/images/scatter.html', 'w') as f:
            f.write(html)
        return html


    
   