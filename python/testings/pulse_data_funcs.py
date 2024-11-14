
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
from scipy.stats import gaussian_kde
from sqlalchemy import create_engine

matplotlib.use('Agg')
pd.set_option('future.no_silent_downcasting', True)

class PulseData:
    def __init__(self):
        server = '10.20.2.10' 
        database = 'pulse' 
        username = 'Pulse_RO' 
        password = 'PD@T@r3@der' 
        # cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
        # self.cursor = cnxn.cursor()
        connection_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}"
        self.engine = create_engine("mssql+pyodbc:///?odbc_connect=" + connection_string)
        self.df = pd.DataFrame()
        self.fig, self.ax = plt.subplots(figure=(2, 2))

    
  
    def get_last_records(self, tags: str) -> List[float]:
        tag_names = [x.strip() for x in tags.split(',')]
        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
        
        query_str = f"select top 1 Value from LoggerValues where LoggerTagID IN ({', '.join(map(str, tag_ids))}) ORDER BY IndexTime DESC"
        with self.engine.connect() as connection:
                df = pd.read_sql(query_str, connection)
                values = df.iloc[0].tolist()
                 
        return values

    
    def clean_df_outliers(self,df, columns=None, threshold=2):
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
                df.loc[outliers, column] = np.nan  # Set outliers to NaN

                # Fill NaN values with the mean
                df[column] = df[column].fillna(mean)

        return df
    
    def clean_array_outliers(self, arr, threshold=4):
        mean = np.mean(arr)
        std = np.std(arr)
        lower_bound = mean - threshold * std
        upper_bound = mean + threshold * std
        print("upper bound: ", upper_bound, "lower bound: ", lower_bound)

        outliers = (arr < lower_bound) | (arr > upper_bound)
        arr[outliers] = np.nan
        arr = np.where(np.isnan(arr), mean, arr)
        
        return arr

   
    def get_data_by_tags(self, tag_names: list, start: dt, end: dt) -> dict:
        start = start.replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S")
        end = end.replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S")

        tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]

        # query_str = f"SELECT  IndexTime, Value FROM LoggerValues WHERE LoggerTagID = {tag_id} \
        #         AND IndexTime BETWEEN '{start}' AND '{end}' ORDER BY IndexTime ASC"
        query_str = f"SELECT IndexTime, Value FROM LoggerValues WHERE LoggerTagID IN ({', '.join(map(str, tag_ids))}) \
                AND IndexTime BETWEEN '{start}' AND '{end}' ORDER BY IndexTime ASC"
        print("QUERY: ", query_str)

            # tag_name = next((tag["name"] for tag in sql_tags if tag["id"] == tag_id), None)
           
        #     data.append({"tagname": tag_name, "df": pd.DataFrame(corrected_rows, columns=['timestamp', 'value'])})
        with self.engine.connect() as connection:
            df = pd.read_sql(query_str, connection)
        
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.set_index('timestamp', inplace=True)
        df = df.resample('1h').mean()
        df.columns = tag_names

        # Find the common indices in the dataframes and trim to the common ones
        # common_indices = data[0]['df'].index
        # for item in data[1:]:
        #     common_indices = common_indices.intersection(item['df'].index)
        # for item in data:
        #     item['df'] = item['df'].loc[common_indices]

        
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
        descr1 = next((tag for tag in sql_tags if tag["name"] == tag1), None)["desc"]
        descr2 = next((tag for tag in sql_tags if tag["name"] == tag2), None)["desc"]
     
        self.fig, self.ax = plt.subplots(figure=(8, 8),  dpi=600)
        g= sns.jointplot(x=tag1, y=tag2, data=self.df, kind="reg", truncate=True, color="blue", height=7)
        # sns.regplot(self.df, x=tag1, y=tag2, ax=self.ax)
        g.ax_joint.set_xlabel(descr1, fontsize=14)
        g.ax_joint.set_ylabel(descr2, fontsize=14)

        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        # plt.savefig("fig.jpg", format="jpg", dpi=600, bbox_inches='tight')
        buf.seek(0)
        plt.close()

        return buf
    
    def get_kde_densities(self, tag: str, sp:float):
        if self.df.shape == (0,0):
            print("No data available")
            return "No data available"
        
        sp = float(sp)
        data =  self.df[tag].to_numpy()
        # data = pd.to_numeric(self.df[tag], errors='coerce').dropna().values
        above = data[data > sp]
        below = data[data <= sp]

        above = self.clean_array_outliers(above, threshold=4)
        below = self.clean_array_outliers(below, threshold=4)

        # # Calculate densities
        def calculate_density(data):
            kde = gaussian_kde(data)

        x = np.linspace(data.min(), data.max(), 1000)

        # Calculate means
        mean_above = np.mean(above)
        mean_below = np.mean(below)

        # Calculate distances from the target value to the means
        distance_above = mean_above - sp
        distance_below = sp - mean_below

        # # Plotting the densities
        plt.figure(figsize=(12, 8))
        sns.kdeplot(data=above, fill=True, color='skyblue', label='Above Target Value')
        sns.kdeplot(data=below, fill=True, color='salmon', label='Below Target Value')
        plt.axvline(sp, color='red', linestyle='--', label='Target Value')
        plt.axvline(mean_above, color='blue', linestyle='--', label='Mean Above', ymax=0.9)
        plt.axvline(mean_below, color='brown', linestyle='--', label='Mean Below', ymax=0.9)
        plt.title('KDE Plot of Sensor Data Above and Below Target Value')
        plt.xlabel('Sensor Data')
        plt.ylabel('Density')

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        # plt.savefig("fig.jpg", format="jpg", dpi=600, bbox_inches='tight')
        buf.seek(0)
        # plt.close()

        return buf

