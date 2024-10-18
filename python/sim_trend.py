import numpy as np

class SimulateTrend:
    def __init__(self, T=10, S0=80, mu=0.1, sigma=1, theta=0.01):
        self.T = T
        self.S0 = S0
        self.mu = mu
        self.sigma = sigma
        self.theta = theta
        self.mean_price = S0
        self.pv = np.zeros(T)
        self.sp = np.zeros(T)
        self.pv[0] = S0
        self.init_data()
    
    def init_data(self):
        self.returns = np.random.normal(self.mu, self.sigma, self.T)
        for t in range(1, self.T):
            self.pv[t] = self.pv[t-1] + self.theta * (self.mean_price - self.pv[t-1]) + self.returns[t]
        self.sp = self.pv + np.random.normal(loc = 0, scale = self.sigma, size = self.T)
        
    def generate_next_price(self,current_price):
        return current_price + self.theta * (self.mean_price - current_price) + np.random.normal(0, self.sigma)

    def simulate_trend(self):
        new_price = self.generate_next_price(self.pv[0])
        self.pv = np.roll(self.pv, 1)
        self.pv[0] = new_price
        return self.pv
    
    def simulate_pv_and_sp(self):
        new_price = self.generate_next_price(self.pv[0])
        self.pv = np.roll(self.pv, 1)
        self.pv[0] = new_price
        self.sp = self.pv + np.random.normal(loc = 0, scale = 5, size = self.T)
        return {"pv": self.pv, "sp": self.sp}
