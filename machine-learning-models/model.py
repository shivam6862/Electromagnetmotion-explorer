# Import necessary libraries
from sklearn.metrics import mean_squared_error
import datetime
import pandas as pd
import matplotlib.pyplot as plt
import csv
import os
import sys
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestRegressor
import matplotlib
import numpy as np
matplotlib.use('Agg')

# Define the upload folder
UPLOAD_FOLDER = 'uploads'
csv_file_path = "machine-learning.csv"
# Add the current directory to the system path
sys.path.append(os.getcwd())


class Models:
    def __init__(self):
        # Initialize Linear Regression and Logistic Regression models
        self.RandomForest = RandomForestRegressor()
        self.decisionTree = DecisionTreeClassifier()

        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        print("Model created!")

        updated_data = []

        # Read existing data from the CSV file and update start_angle for the first row
        with open(csv_file_path, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if reader.line_num == 1:
                    row['start_angle'] = 10.0
                updated_data.append(row)

        updated_data_df = pd.DataFrame(updated_data)
        X_train = updated_data_df.drop(columns=["angle"])
        y_train = updated_data_df["angle"]

        print(X_train.head())
        print(y_train.head())

        # Fit Linear Regression and Logistic Regression models with training data
        self.RandomForest.fit(X_train, y_train)
        self.decisionTree.fit(X_train, y_train)

        print("CSV file updated successfully.")

    def model(self, dataset):
        randomForest_reg = self.RandomForest
        decision_tree_reg = self.decisionTree

        # Convert timeInMillisec to seconds
        for entry in dataset:
            entry['timeInMillisec'] = int(entry['timeInMillisec'])/1000

        # Extract actual angles from the dataset
        actual_angles = [data_point["angle"] for data_point in dataset]
        # Print the resulting array of actual angles
        print("actual_angles", actual_angles)

        updated_data = []

        # Read existing data from the CSV file and update start_angle for the first row
        for entry in dataset:
            updated_data.append({
                'angle': entry['angle'],
                'timeInMillisec': entry['timeInMillisec'],
                'start_angle': dataset[0]['angle'],
                'initial_velocity': 0
            })

        # Write the updated data to the CSV file
        updated_data_df = pd.DataFrame(updated_data)
        X_test = updated_data_df.drop(columns=["angle"])
        # y_test = updated_data_df["angle"]
        y_test = updated_data_df["angle"].values.astype(float)

        print(updated_data_df.head())

        print(1)
        # Make predictions using both models on test data
        # linear_reg_preds = linear_reg.predict(X_test)
        decision_tree_reg_preds = decision_tree_reg.predict(X_test)
        decision_tree_reg_preds = [float(pred)
                                   for pred in decision_tree_reg_preds]
        randomForest_preds_reg_preds = randomForest_reg.predict(X_test)

        # Create a dictionary to store model predictions
        predictions_df = ({
            # 'Linear Regression': linear_reg_preds,
            "real data": y_test,
            'Decision Tree': decision_tree_reg_preds,
            'Random Forest': randomForest_preds_reg_preds,
        })

        print(2)
        # Create a figure and axis for plotting
        plt.figure(figsize=(10, 6))

        # Plot actual values from the test data
        # plt.plot(actual_angles, label='Actual Values',
        #          marker='o', linestyle='-', color='b')

        # Plot predictions for each model
        color = ["r", "g", "b"]
        i = 0
        for model, preds in predictions_df.items():
            print(model, preds)
            plt.plot(preds, label=f'{model} Predictions',
                     marker='o', linestyle='-', color=color[i])
            i = i+1

         # Add labels and title to the plot
        plt.xlabel('Data Points')
        plt.ylabel('Values')
        plt.title('Actual vs Predicted Values')
        plt.legend()  # Add legend

        # Get the current date and time
        current_time = datetime.datetime.now()
        # Format the current time as a string (for example: "2023-11-07-15-30-45")
        formatted_time = current_time.strftime("%Y-%m-%d-%H-%M-%S")
        # Create the link with the formatted time
        link = f"actual_vs_predicted_{formatted_time}.png"

        # Save the plot as an image file in the uploads directory
        plt.savefig(os.path.join(UPLOAD_FOLDER, link))

        print(3)
        print("decision_tree_reg_preds", decision_tree_reg_preds)
        # decision_tree_reg_preds = decision_tree_reg_preds.astype(float)
        # Create an empty list to store MSE values
        mse_values_decision = []  # Create an empty list to store MSE values
        for actual_angle, prediction in zip(actual_angles, decision_tree_reg_preds):
            # Calculate MSE for each data point
            mse = mean_squared_error([actual_angle], [prediction])
            mse_values_decision.append(mse)  # Add MSE value to the list

        print("mse_values_decision", mse_values_decision)

        # Create a figure
        plt.figure(figsize=(10, 6))
        # Plot MSE values for each data point
        plt.plot(range(len(mse_values_decision)), mse_values_decision,
                 marker='o', color='b', label='MSE')
        # Add labels and title
        plt.xlabel('Data Points')
        plt.ylabel('Mean Squared Error for decision tree')
        plt.title('Mean Squared Error for Each Data Point')
        # Add legend
        plt.legend()
        # Create the link with the formatted time
        link_for_mse_decision = f"mean_squared_error_{formatted_time}.png"
        # Save the plot as an image file in the uploads directory
        plt.savefig(os.path.join(UPLOAD_FOLDER, link_for_mse_decision))

        print(4)
        print("randomForest_preds_reg_preds", randomForest_preds_reg_preds)
        # randomForest_preds_reg_preds = randomForest_preds_reg_preds.astype(
        #     float)
        # Create an empty list to store MSE values
        mse_values_random_forest = []  # Create an empty list to store MSE values
        for actual_angle, prediction in zip(actual_angles, randomForest_preds_reg_preds):
            # Calculate MSE for each data point
            mse = mean_squared_error([actual_angle], [prediction])
            mse_values_random_forest.append(mse)  # Add MSE value to the list

        print("mse_values_random_forest", mse_values_random_forest)
        # Create a figure
        plt.figure(figsize=(10, 6))
        # Plot MSE values for each data point
        plt.plot(range(len(mse_values_random_forest)), mse_values_random_forest,
                 marker='o', color='g', label='MSE')
        # Add labels and title
        plt.xlabel('Data Points')
        plt.ylabel('Mean Squared Error by random forest')
        plt.title('Mean Squared Error for Each Data Point')
        # Add legend
        plt.legend()
        # Create the link with the formatted time
        link_for_mse_random_forest = f"mean_squared_error_random_forest{formatted_time}.png"
        # Save the plot as an image file in the uploads directory
        plt.savefig(os.path.join(UPLOAD_FOLDER, link_for_mse_random_forest))

        print(5)
        # Read existing data from the CSV file and update start_angle for the first row
        with open(csv_file_path, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if reader.line_num == 1:
                    # Update start_angle for the first row
                    row['start_angle'] = 10.0
                updated_data.append(row)

        # Write the updated data to the CSV file
        with open(csv_file_path, mode='w', newline='') as file:
            writer = csv.writer(file)

            # Write header
            writer.writerow(['angle', 'timeInMillisec',
                            'start_angle', 'initial_velocity'])

            # Write data to the CSV file
            for row in updated_data:
                writer.writerow(
                    [row['angle'], row['timeInMillisec'], row['start_angle'], row["initial_velocity"]])

        return [link, link_for_mse_decision, link_for_mse_random_forest]
