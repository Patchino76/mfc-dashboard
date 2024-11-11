#%%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gaussian_kde
import seaborn as sns
#%%
# Sample DataFrame
data = {
    'timestamp': pd.date_range(start='2023-01-01', periods=100, freq='H'),
    'sensor_data': np.random.randn(100)
}
df = pd.DataFrame(data)

# Define the target value
target_value = 0.8

# Split the data into above and below the target value
above_target = df[df['sensor_data'] > target_value]
below_target = df[df['sensor_data'] <= target_value]

# Calculate densities
def calculate_density(data):
    kde = gaussian_kde(data)
    return kde

above_density = calculate_density(above_target['sensor_data'])
below_density = calculate_density(below_target['sensor_data'])
#%%
# Plotting the densities
x = np.linspace(df['sensor_data'].min(), df['sensor_data'].max(), 1000)
plt.figure(figsize=(10, 6))
plt.plot(x, above_density(x), label='Above Target Value')
plt.plot(x, below_density(x), label='Below Target Value')
plt.axvline(target_value, color='red', linestyle='--', label='Target Value')
plt.title('Density of Sensor Data Above and Below Target Value')
plt.xlabel('Sensor Data')
plt.ylabel('Density')
plt.legend()
plt.show()
# %%
# Calculate the number of data points above and below the target value
above_target_count = df[df['sensor_data'] > target_value].shape[0]
below_target_count = df[df['sensor_data'] <= target_value].shape[0]

# Calculate the total number of data points
total_count = df.shape[0]

# Calculate the percentages
above_target_percentage = (above_target_count / total_count) * 100
below_target_percentage = (below_target_count / total_count) * 100

print(f"Percentage of data above target: {above_target_percentage:.2f}%")
print(f"Percentage of data below target: {below_target_percentage:.2f}%")
# %%
# Mean Absolute Deviation (MAD)

# Calculate the absolute deviations from the target value
df['deviation'] = np.abs(df['sensor_data'] - target_value)

# Calculate the mean absolute deviation for above and below target
above_target_mad = df[df['sensor_data'] > target_value]['deviation'].mean()
below_target_mad = df[df['sensor_data'] <= target_value]['deviation'].mean()

print(f"Mean Absolute Deviation above target: {above_target_mad:.2f}")
print(f"Mean Absolute Deviation below target: {below_target_mad:.2f}")
# %%
#Weighted Density

# Calculate the weights based on distance from the target value
df['weights'] = np.abs(df['sensor_data'] - target_value)

# Split the data into above and below the target value
above_target = df[df['sensor_data'] > target_value]
below_target = df[df['sensor_data'] <= target_value]

# Calculate weighted densities
def calculate_weighted_density(data, weights):
    kde = gaussian_kde(data, weights=weights)
    return kde

above_density = calculate_weighted_density(above_target['sensor_data'], above_target['weights'])
below_density = calculate_weighted_density(below_target['sensor_data'], below_target['weights'])

# Plotting the weighted densities
x = np.linspace(df['sensor_data'].min(), df['sensor_data'].max(), 1000)
plt.figure(figsize=(10, 6))
plt.plot(x, above_density(x), label='Above Target Value (Weighted)')
plt.plot(x, below_density(x), label='Below Target Value (Weighted)')
plt.axvline(target_value, color='red', linestyle='--', label='Target Value')
plt.title('Weighted Density of Sensor Data Above and Below Target Value')
plt.xlabel('Sensor Data')
plt.ylabel('Weighted Density')
plt.legend()
plt.show()
# %%
# Calculating the Means and Distances
above_target = df[df['sensor_data'] > target_value]
below_target = df[df['sensor_data'] <= target_value]

# Calculate the means
mean_above_target = above_target['sensor_data'].mean()
mean_below_target = below_target['sensor_data'].mean()

# Calculate the distances from the target value
distance_above_target = mean_above_target - target_value
distance_below_target = target_value - mean_below_target

print(f"Mean of data above target: {mean_above_target:.2f}")
print(f"Mean of data below target: {mean_below_target:.2f}")
print(f"Distance of mean above target from target value: {distance_above_target:.2f}")
print(f"Distance of mean below target from target value: {distance_below_target:.2f}")
# %%
plt.figure(figsize=(12, 8))
sns.histplot(above_target['sensor_data'], color='blue', kde=True, label='Above Target Value', bins=20)
sns.histplot(below_target['sensor_data'], color='orange', kde=True, label='Below Target Value', bins=20)
plt.axvline(target_value, color='red', linestyle='--', label='Target Value')
plt.title('Histogram of Sensor Data Above and Below Target Value')
plt.xlabel('Sensor Data')
plt.ylabel('Frequency')
plt.legend()
plt.show()
# %%
plt.figure(figsize=(12, 8))
sns.histplot(above_target['sensor_data'], color='skyblue', kde=True, label='Above Target Value', bins=20, alpha=0.6)
sns.histplot(below_target['sensor_data'], color='salmon', kde=True, label='Below Target Value', bins=20, alpha=0.6)
plt.axvline(target_value, color='red', linestyle='--', label='Target Value')
plt.title('Histogram of Sensor Data Above and Below Target Value')
plt.xlabel('Sensor Data')
plt.ylabel('Frequency')
plt.legend()
plt.show()
# %%
# Plotting the KDE plots
sns.set_theme(style="whitegrid")

# Create a combined KDE plot
plt.figure(figsize=(12, 8))
sns.kdeplot(data=above_target['sensor_data'], fill=True, color='skyblue', label='Above Target Value')
sns.kdeplot(data=below_target['sensor_data'], fill=True, color='salmon', label='Below Target Value')
plt.axvline(target_value, color='red', linestyle='--', label='Target Value')
plt.title('KDE Plot of Sensor Data Above and Below Target Value')
plt.xlabel('Sensor Data')
plt.ylabel('Density')
plt.legend()
plt.show()
# %%
