#%%
from sqlalchemy import create_engine
import pandas as pd

#%%
class PulseData:

    def __init__(self):
        server = '10.20.2.10'
        database = 'pulse'
        username = 'Pulse_RO'
        password = 'PD@T@r3@der'
        connection_string = f"mssql+pyodbc://{username}:{password}@{server}:1433/{database}?driver=ODBC+Driver+17+for+SQL+Server"

        self.engine = create_engine(connection_string)
        self.df = pd.DataFrame()

    def fetch_data(self, query: str):
        with self.engine.connect() as connection:
            self.df = pd.read_sql(query, connection)

# Example usage
pulse_data = PulseData()
pulse_data.fetch_data("select top 10 * from LoggerValues")
print(pulse_data.df.head())

# %%
