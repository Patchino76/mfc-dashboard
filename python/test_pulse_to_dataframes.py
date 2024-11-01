#%%
import datetime
from typing import List
import pyodbc 
import pandas as pd
from  tags_definition import sql_tags

#%%%

        
server = '10.20.2.10' 
database = 'pulse' 
username = 'Pulse_RO' 
password = 'PD@T@r3@der' 
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()

# %%
tag_names = ["RECOVERY_LINE1_CU_LONG",     "CUFLOTAS2-S7-400PV_CU_LINE_1",     "CUFLOTAS2-S7-400PV_FE_LINE1"]
tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
# %%

data = []
for tag_id in tag_ids:
    query_str = f"SELECT TOP {300} IndexTime, Value FROM LoggerValues WHERE LoggerTagID = {tag_id} ORDER BY IndexTime DESC"
    cursor.execute(query_str)
    rows = cursor.fetchall()
    rows = [list(row) for row in rows]

    tag_name = next((tag["name"] for tag in sql_tags if tag["id"] == tag_id), None)
    data.append({"tagname": tag_name, "df": pd.DataFrame(rows, columns=['timestamp', 'value'])})
    

# %%
for item in data: #fixing the dt index
    item['df']['timestamp'] = pd.to_datetime(item['df']['timestamp'])
    item['df'].set_index('timestamp', inplace=True)
# %%
# Find the common time range

start_date = datetime.datetime(2024, 10, 28, 6, 0)
end_date = datetime.datetime.now()
print(start_date, end_date)
# %%
# Trim and resample DataFrames
for item in data:
    item['df'] = item['df'].loc[end_date:start_date].resample('1h').mean()
    print(item['tagname'], item['df'].shape)
    print(item['df'].head(1))
    print(item['df'].tail(1))

# %%
# Find the common indices
common_indices = data[0]['df'].index
for item in data[1:]:
    common_indices = common_indices.intersection(item['df'].index)

# Trim DataFrames to common indices
for item in data:
    item['df'] = item['df'].loc[common_indices]
    print(item['tagname'], item['df'].shape)
    print(item['df'].head(1))
    print(item['df'].tail(1))
# %%
# Concatenate DataFrames
result = pd.concat([item['df'].rename(columns={'value': item['tagname']}) for item in data], axis=1)
# result = pd.concat([item['df']], axis=1)
result = result.ffill()
print(result.head())
# %%
print(result.to_dict(orient='records'))
# %%
