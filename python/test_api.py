#%%
import requests

response = requests.get(
    'http://localhost:8000/pulse',
    params={'tags': ['RECOVERY_LINE1_CU_LONG', 'RECOVERY_LINE2_CU_LONG'], 'num_records': 12}, 
)

try:
    data = response.json()
    print(data)
except requests.JSONDecodeError:
    print("Error: Response is not valid JSON")
    print(response.text)

print(response.url)

# %%
response = requests.get(
    'http://localhost:8000/pulse-last',
    params={'tags': ['RECOVERY_LINE1_CU_LONG', 'RECOVERY_LINE2_CU_LONG']}, 
)
try:
    data = response.json()
    print(data)
except requests.JSONDecodeError:
    print("Error: Response is not valid JSON")
    print(response.text)

print(response.url)
# %%
