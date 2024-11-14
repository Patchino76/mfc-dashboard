#%%
import pandas as pd
import sqlite3
# %%
conn = sqlite3.connect('dispatchers.db')

# Execute the SQL query to retrieve the data
query = 'SELECT * FROM dispatchers'
df = pd.read_sql_query(query, conn)

# Close the database connection
conn.close()
# %%
df.info()
# %%
