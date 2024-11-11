
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
from datetime import datetime as dt, timedelta
import io

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
        self.fig, self.ax = plt.subplots(figure=(2, 2))

    
  
    def get_last_records(self, tags: str) -> List[float]:
        tag_names = [x.strip() for x in tags.split(',')]

        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
        
        values = []
        for tag_id in tag_ids:
            query_str = f"select top 1 Value from LoggerValues where LoggerTagID = {tag_id} ORDER BY IndexTime DESC"
            self.cursor.execute(query_str)
            rows = self.cursor.fetchall()

            if rows:  # Check if rows is not empty
                values.append(float(rows[0][0]))

        return values

    
    def clean_df_outliers(self,df, columns=None, threshold=4):
        if columns is None:
            columns = df.columns
            
        for column in columns:
            if pd.api.types.is_numeric_dtype(df[column]):
                mean = df[column].mean()
                std = df[column].std()
                # Calculate the upper and lower bounds
                lower_bound = mean - threshold * std
                upper_bound = mean + threshold * std
                print("upper bound: ", upper_bound, "lower bound: ", lower_bound)
                
                # Replace outliers with NaN first to avoid overwriting valid data
                outliers = (df[column] < lower_bound) | (df[column] > upper_bound)
                df.loc[outliers, column] = None  # Set outliers to NaN
                
                # Fill NaN values with the mean
                df = df[df > 0]
                df[column] = df[column].fillna(mean)

        return df

   
    def get_data_by_tags(self, tag_names: list, start: dt, end: dt) -> dict:
        start = start.replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S")
        end = end.replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S")

        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]

        data = []
        for tag_id in tag_ids:
            query_str = f"SELECT  IndexTime, Value FROM LoggerValues WHERE LoggerTagID = {tag_id} \
                AND IndexTime BETWEEN '{start}' AND '{end}' ORDER BY IndexTime ASC"
            self.cursor.execute(query_str)
            rows = self.cursor.fetchall()
            rows = [list(row) for row in rows]

            corrected_rows = []
            for row in rows:
                index_time = row[0]
                # Assuming the timestamp is 2 hours ahead
                corrected_time = index_time + timedelta(hours=2)
                corrected_rows.append([corrected_time, row[1]])

            tag_name = next((tag["name"] for tag in sql_tags if tag["id"] == tag_id), None)
           
            data.append({"tagname": tag_name, "df": pd.DataFrame(corrected_rows, columns=['timestamp', 'value'])})

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
        df = df.iloc[::-1]
        df_to_dict = {index.strftime("%Y-%m-%d %H:%M"): row.to_dict() for index, row in df.iterrows()}

        self.df = df
        print(self.df)
        return df_to_dict
            

    # MPLD3 version 0.5.10 is working so install it from pip
    def get_scatter(self, tag1: str="X", tag2: str="Y") -> str:
        if self.df.shape == (0,0):
            print("No data available")
            return "No data available"

        tag2 = 'RECOVERY_LINE1_CU_LONG'
        tag1 = 'CUFLOTAS2-S7-400PV_CU_LINE_1'
        # tag2 = 'CUFLOTAS2-S7-400PV_FE_LINE1'
        desc1 = next((tag for tag in sql_tags if tag["name"] == tag1), None)["desc"]
        desc2 = next((tag for tag in sql_tags if tag["name"] == tag2), None)["desc"]
        # title = "Диаграма на разпърскване"
     
        self.fig, self.ax = plt.subplots(figure=(10, 10),  dpi=90)
        # sns.regplot(self.df, x=tag1, y=tag2, ax=self.ax)


        # print(self.df.head())
        g = sns.jointplot(x=tag2, y=tag1, data=self.df, kind="reg", truncate=False, color="m", height=7, ax = self.ax)
        # g.fig.suptitle("Scatter Plot with Regression Line", y=1.03)
        # self.ax.set_title(title)  
        self.ax.set_xlabel(desc1)
        self.ax.set_ylabel(desc2)
        
        # plt.savefig("fig.jpg", format="jpg", dpi=300, bbox_inches='tight')
        # mpld3.show()
        # mpld3.save_html(self.fig, 'scatter2.html')
        html = mpld3.fig_to_html(self.fig)
        return html
    
    def get_image(self, tag1: str="X", tag2: str="Y") -> str:
        if self.df.shape == (0,0):
            print("No data available")
            return "No data available"
        
        tag1 = 'RECOVERY_LINE1_CU_LONG'
        tag2 = 'CUFLOTAS2-S7-400PV_CU_LINE_1'
        # tag2 = 'CUFLOTAS2-S7-400PV_FE_LINE1'
        desc1 = next((tag for tag in sql_tags if tag["name"] == tag1), None)["desc"]
        desc2 = next((tag for tag in sql_tags if tag["name"] == tag2), None)["desc"]
     
        self.fig, self.ax = plt.subplots(figure=(8, 8),  dpi=600)
        g= sns.jointplot(x=tag1, y=tag2, data=self.df, kind="reg", truncate=True, color="blue", height=7)
        # sns.regplot(self.df, x=tag1, y=tag2, ax=self.ax)
        g.ax_joint.set_xlabel(desc1, fontsize=14)
        g.ax_joint.set_ylabel(desc2, fontsize=14)

        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        # plt.savefig("fig.jpg", format="jpg", dpi=600, bbox_inches='tight')
        buf.seek(0)
        plt.close()

        return buf