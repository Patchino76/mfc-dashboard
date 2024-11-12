#%%
import pyodbc 
import numpy as np
from  tags_definition import sql_tags
#%%
server = '10.20.2.10' 
database = 'pulse' 
username = 'Pulse_RO' 
password = 'PD@T@r3@der' 
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()

#%%

def get_data_by_tag(tag_name: str, counts: int = 10) -> np.ndarray:
    tag_id = next((tag["id"] for tag in sql_tags if tag["name"] == tag_name), None)
    if tag_id is None:
        raise ValueError(f"Tag '{tag_name}' not found.")
    
    query_str = f"select top {counts} IndexTime, LoggerTagID, Value from \
        LoggerValues where LoggerTagID = {tag_id} order by IndexTime desc"
    cursor.execute(query_str)
    rows = cursor.fetchall()
    
    values = np.array([float(row[2]) for row in rows])
    return values

get_data_by_tag("RECOVERY_LINE1_CU_LONG")
#%%
def get_data_by_tags(tag_names: list, counts: int = 10) -> np.ndarray:
    tag_ids = [next((tag["id"] for tag in sql_tags if tag["name"] == name), None) for name in tag_names]
    if any(id is None for id in tag_ids):
        raise ValueError("One or more tags not found.")
    
    values = []
    for tag_id in tag_ids:
        query_str = f"select top {counts} IndexTime, LoggerTagID, Value from LoggerValues where LoggerTagID = {tag_id} order by IndexTime desc"
        cursor.execute(query_str)
        rows = cursor.fetchall()
        values.append(np.array([float(row[2]) for row in rows]))
    
    return np.array(values)

tag_names = ["RECOVERY_LINE3_CU_LONG", "RECOVERY_LINE4_CU_LONG"]
values = get_data_by_tags(tag_names)
print(values)
# %%

