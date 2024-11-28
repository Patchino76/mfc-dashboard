#%%
from sst_downtimes import SstDowntimes

#%%
sst = SstDowntimes()

# %%
# SST_FB_LONG_BELT_STR
start='2024-11-25 00:00:00'
end='2024-11-28 23:59:59'
downtimes_df = sst.calculate_downtimes('SST_CB_KUBRIA_ON_STR2', start, end)
print(downtimes_df)
downtimes_df = sst.calculate_downtimes('SST_FB_LONG_BELT_STR2', start, end)
print(downtimes_df)
# %%
