#%%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gaussian_kde
import seaborn as sns
#%%
# Sample DataFrame
data = np.random.randn(100)
sp = 0.5
above = data[data > sp]
below = data[data <= sp]


# Calculate densities
def calculate_density(data):
    kde = gaussian_kde(data)
    return kde

above_density = calculate_density(above)
below_density = calculate_density(below)
x = np.linspace(data.min(), data.max(), 1000)
# Calculate means
mean_above = np.mean(above)
mean_below = np.mean(below)

# Calculate distances from the target value to the means
distance_above = mean_above - sp
distance_below = sp - mean_below
#%%
# Plotting the densities
plt.figure(figsize=(12, 8))
sns.kdeplot(data=above, fill=True, color='skyblue', label='Above Target Value')
sns.kdeplot(data=below, fill=True, color='salmon', label='Below Target Value')
plt.axvline(sp, color='red', linestyle='--', label='Target Value')
plt.axvline(mean_above, color='blue', linestyle='--', label='Mean Above', ymax=0.9)
plt.axvline(mean_below, color='brown', linestyle='--', label='Mean Below', ymax=0.9)
plt.title('KDE Plot of Sensor Data Above and Below Target Value')
plt.xlabel('Sensor Data')
plt.ylabel('Density')
plt.legend()
plt.show()

# %%
