#%%
import numpy as np
import matplotlib.pyplot as plt
import time

#%%
# Parameters
T = 10  # Total time steps (fixed array size)
S0 = 100  # Initial stock price
mu = 0.05  # Daily return
sigma = 1  # Daily volatility
theta = 0.01  # Speed of reversion to the mean
mean_price = S0  # Mean price around which the stock fluctuates

# Generate initial trend
np.random.seed(42)
returns = np.random.normal(mu, sigma, T)
price = np.zeros(T)
price[0] = S0

for t in range(1, T):
    price[t] = price[t-1] + theta * (mean_price - price[t-1]) + returns[t]

# Function to generate the next price point
def generate_next_price(current_price, mean_price, theta, sigma):
    return current_price + theta * (mean_price - current_price) + np.random.normal(0, sigma)

# Real-time update
while True:  # Infinite loop
    new_price = generate_next_price(price[0], mean_price, theta, sigma)
    price = np.roll(price, 1)  # Shift all elements to the right
    price[0] = new_price  # Insert new price at the beginning
    print(price)
    time.sleep(5)  # Pause for 1 second to simulate real-time update
# %%
