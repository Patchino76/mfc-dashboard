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
from data_utils import clean_array_outliers, clean_df_outliers, clean_df_outliers_percentiles

matplotlib.use('Agg')
pd.set_option('future.no_silent_downcasting', True)

class ApiDependancies(BaseModel):
    tags: Optional[str]  = "RECOVERY_LINE1_CU_LONG,CUFLOTAS2-S7-400PV_CU_LINE_1,CUFLOTAS2-S7-400PV_FE_LINE1" 
    start: Optional[str] = (datetime.datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d %H:%M:%S")
    end: Optional[str] =  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sp: Optional[float] = 88.88
    clean_array_outliers = staticmethod(clean_array_outliers)
    clean_df_outliers = staticmethod(clean_df_outliers)
    class Config:
        arbitrary_types_allowed = True
    def __init__(self, **data):
        super().__init__(**data)
        self._df = None

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
        print("QUERY fetch data: ", query_str)

        with engine.connect() as connection:
            df = pd.read_sql(query_str, connection)
        
            df['timestamp'] = pd.to_datetime(df['IndexTime'])
            df = df.drop_duplicates()
            df.set_index('timestamp', inplace=True)
            df.drop('IndexTime', axis=1, inplace=True)
            

            tag_dict = {tag['id']: tag['name'] for tag in sql_tags}
            df_pivoted = df.pivot(columns='LoggerTagID', values='Value')
            df_pivoted.columns = [tag_dict[col] for col in df_pivoted.columns]
            # df_pivoted = clean_df_outliers_percentiles(df_pivoted, lower_percentile=0.2, upper_percentile=0.8)
            df_pivoted = clean_df_outliers(df_pivoted, threshold=2)
            df_pivoted = df_pivoted.resample('1h').mean()
            df_pivoted = df_pivoted.ffill().infer_objects(copy=False)
            df_pivoted = df_pivoted.iloc[::-1]  # reverse the dataframe
            df_pivoted.dropna(inplace=True, how='any')
            self.df = df_pivoted
            print(self.df)
            return df_pivoted
        
    def fetch_last_records(self) -> List[float]:
        engine = self.sql_connect()
        tags_as_list = self.tags.split(',')
        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tags_as_list]

        # query_str = f"select top 1 Value from LoggerValues where LoggerTagID IN ({', '.join(map(str, tag_ids))}) ORDER BY IndexTime DESC"
        query_str = text(f"SELECT TOP 1 Value FROM LoggerValues WHERE LoggerTagID IN ({', '.join(map(str, tag_ids))}) ORDER BY IndexTime DESC")
        with engine.connect() as connection:
            values = []
            for tag_id in tag_ids:
                query_str = text(f"SELECT TOP 1 Value FROM LoggerValues WHERE LoggerTagID = {tag_id} ORDER BY IndexTime DESC")
                result = connection.execute(query_str)
                value = result.scalar()  # Fetch the first column of the first row
                values.append(value)
            return values
        
    def get_reg_plot(self, tag1: str = "RECOVERY_LINE1_CU_LONG", tag2: str = "CUFLOTAS2-S7-400PV_CU_LINE_1") -> str:
        if self.df is None:
            self.fetch_data()
        # df = self.fetch_data()
        # print(df)
        
        descr1 = next((tag for tag in sql_tags if tag["name"] == tag1), None)["desc"]
        descr2 = next((tag for tag in sql_tags if tag["name"] == tag2), None)["desc"]
     
        # fig, ax = plt.subplots(figure=(12, 8),  dpi=600)
        plt.figure(figsize=(12, 8))
        g= sns.jointplot(x=tag1, y=tag2, data=self.df, kind="reg", truncate=True, color="blue", height=7)
        g.ax_joint.set_xlabel(descr1, fontsize=18)
        g.ax_joint.set_ylabel(descr2, fontsize=18)
        plt.title(f"regression {np.random.randint(1, 100)}", fontsize=18)
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        plt.close()

        return buf

        
    def get_kde_plot(self, tag: str = "RECOVERY_LINE1_CU_LONG", sp: float = 88.8) -> str:
        if self.df is None:
            self.fetch_data()
        
        sp = float(sp)
        data =  self.df[tag].to_numpy()
        above = data[data > sp]
        below = data[data <= sp]

        x = np.linspace(data.min(), data.max(), 1000)

        mean_above = np.mean(above)
        mean_below = np.mean(below)

        # Calculate distances from the target value to the means
        distance_above = mean_above - sp
        distance_below = sp - mean_below

        percentage_above = (len(above) / len(data)) * 100
        percentage_below = (len(below) / len(data)) * 100

        # # Plotting the densities
        plt.figure(figsize=(12, 8))
        sns.kdeplot(data=above, fill=True, color='skyblue', label='Над целта')
        sns.kdeplot(data=below, fill=True, color='salmon', label='Под целта')
        plt.axvline(sp, color='red', linestyle='--', label=f'Цел (SP) {sp:.2f}')
        plt.axvline(mean_above, color='blue', linestyle='--', label=f'Средно над SP {distance_above:.2f}', ymax=0.9)
        plt.axvline(mean_below, color='brown', linestyle='--', label=f'Средно под SP {distance_below:.2f}', ymax=0.9)
        plt.title(f"Процентно разпределение над SP: {percentage_above:.2f}% и под SP: {percentage_below:.2f}%", fontsize=20)
        plt.xlabel('Извличане', fontsize=16)
        plt.ylabel('Плътност', fontsize=16)
        plt.legend(fontsize=14)

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        plt.close()
        return buf

