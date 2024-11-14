#%%
import pandas as pd
import sqlite3
# %%
file_path = 'Doklad_Dispecheri_2022_.xlsx'


xls = pd.ExcelFile(file_path)
# %%
columns_of_interest = ['D', 'E', 'F', 'E','F','G', 'H','I','J','K','L','M','N','P','R','T','V','X','Z', 'AC','AE', 'AG', 'AH', 'AI', 'AJ','AK', 'AL','AM']
# Convert column letters to column indices (0-based)
# column_indices = [ord(col) - ord('A') for col in columns_of_interest]
def excel_col_to_index(col):
    index = 0
    for char in col:
        index = index * 26 + (ord(char.upper()) - ord('A')) + 1
    return index - 1

column_indices = [excel_col_to_index(col) for col in columns_of_interest]
# Read the Excel file
xls = pd.ExcelFile(file_path)

# Initialize an empty list to hold DataFrames
df_list = []

for sheet_name in xls.sheet_names:
    df = pd.read_excel(file_path, sheet_name=sheet_name, usecols=column_indices)
    df_list.append(df)

# Concatenate all DataFrames in the list into a single DataFrame
combined_df = pd.concat(df_list, ignore_index=True)


# %%

df = combined_df.drop(df.index[0:2])
df.columns = df.columns.str.replace('\n', ' ')
# Convert all columns to numeric, setting errors='coerce' to convert non-numeric values to NaN
df = df.apply(pd.to_numeric, errors='coerce')
df = df.dropna()
df.reset_index(drop=True, inplace=True)

# %%
# indices_to_drop = [i for i in range(len(df)) if (i + 1) % 4 == 0]  #remove every 4th index
# df = df.drop(indices_to_drop)
# df.reset_index(drop=True, inplace=True)
print(df)
df.to_csv('dispatchers.csv', index=True)
# %%

import seaborn as sns
import matplotlib.pyplot as plt
# %%
corr_matrix = df.corr()

# Plot the heatmap of the correlation matrix
plt.figure(figsize=(25, 25))
sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap='viridis')
plt.show()
# %%

column_names = [
    "DailyOreInput",
    "Stock2Status",
    "CrushedOreSST",
    "Class15",
    "Class12",
    "TransportedOre",
    "IntermediateBunkerStatus",
    "ProcessedOreMFC",
    "OreMoisture",
    "DryProcessedOre",
    "Granite",
    "Dikes",
    "Shale",
    "GrindingClassPlus0_20mm",
    "GrindingClassMinus0_08mm",
    "PulpDensity",
    "CopperContentOre",
    "CopperContentWaste",
    "CopperContentConcentrate",
    "TechExtraction",
    "LoadExtraction",
    "CopperConcentrate",
    "ConcentrateMoisture",
    "CopperContent",
    "MetalCopper",
    "ThickenerWeight"
]
df.columns = column_names
df.to_sql('dispatchers', con=sqlite3.connect('dispatchers.db'), if_exists='replace', index=False)
df.to_csv('dispatchers_en.csv', index=True)


# %%
