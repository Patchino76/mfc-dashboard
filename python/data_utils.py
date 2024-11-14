import numpy as np
import pandas as pd


# cleans outliers for numeric 1D data
def clean_array_outliers(arr, threshold=4):
        mean = np.mean(arr)
        std = np.std(arr)
        lower_bound = mean - threshold * std
        upper_bound = mean + threshold * std
        # print("upper bound: ", upper_bound, "lower bound: ", lower_bound)

        outliers = (arr < lower_bound) | (arr > upper_bound)
        arr[outliers] = np.nan
        arr = np.where(np.isnan(arr), mean, arr)
        
        return arr

def clean_df_outliers(df, threshold=4):
    def clean_column_outliers(col, threshold):
        mean = np.mean(col)
        std = np.std(col)
        lower_bound = mean - threshold * std
        upper_bound = mean + threshold * std

        outliers = (col < lower_bound) | (col > upper_bound)
        col[outliers] = np.nan
        
        below_zero = col <= 0
        col[below_zero] = np.nan
        col = np.where(np.isnan(col), np.mean(col), col)
        
        return col

    cleaned_df = df.copy()
    for column in cleaned_df.columns:
        if cleaned_df[column].dtype.kind in 'biufc':  # Check if the column is numeric
            cleaned_df[column] = clean_column_outliers(cleaned_df[column], threshold)
    
    return cleaned_df

# def clean_df_outliers_with_median(df, threshold=3):
#     def clean_column_outliers(col, threshold):
#         median = np.median(col)
#         mad = np.median(np.abs(col - median))
#         lower_bound = median - threshold * mad
#         upper_bound = median + threshold * mad

#         outliers = (col < lower_bound) | (col > upper_bound)
#         col[outliers] = np.nan
#         col = np.where(np.isnan(col), median, col)
        
#         return col

#     cleaned_df = df.copy()
#     for column in cleaned_df.columns:
#         if cleaned_df[column].dtype.kind in 'biufc':  # Check if the column is numeric
#             cleaned_df[column] = clean_column_outliers(cleaned_df[column], threshold)
    
#     return cleaned_df

def clean_df_outliers_percentiles(df, lower_percentile=0.05, upper_percentile=0.95):
    def clean_column_outliers(col, lower_percentile, upper_percentile):
        lower_bound = np.percentile(col, lower_percentile * 100)
        upper_bound = np.percentile(col, upper_percentile * 100)

        outliers = (col < lower_bound) | (col > upper_bound)
        col[outliers] = np.nan
        
        below_zero = col <= 0
        col[below_zero] = np.nan
        col = np.where(np.isnan(col), np.mean(col), col)

        
        return col

    cleaned_df = df.copy()
    for column in cleaned_df.columns:
        if cleaned_df[column].dtype.kind in 'biufc':  # Check if the column is numeric
            cleaned_df[column] = clean_column_outliers(cleaned_df[column], lower_percentile, upper_percentile)
    
    return cleaned_df