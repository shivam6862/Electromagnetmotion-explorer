# Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt
import csv
import os
import sys
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
import matplotlib
matplotlib.use('Agg')

# Define the upload folder
UPLOAD_FOLDER = 'uploads'
csv_file_path = "machine-learning.csv"
# Add the current directory to the system path
sys.path.append(os.getcwd())


class Models:
    def __init__(self):
        # Initialize Linear Regression and Logistic Regression models
        self.linear = LinearRegression()
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
        X_train = updated_data_df.drop(columns=["timeInMillisec"])
        y_train = updated_data_df["timeInMillisec"]

        print(X_train.head())
        print(y_train.head())

        # Fit Linear Regression and Logistic Regression models with training data
        self.linear.fit(X_train, y_train)
        self.decisionTree.fit(X_train, y_train)

        print("CSV file updated successfully.")

    def model(self, dataset):
        linear_reg = self.linear
        decision_tree_reg = self.decisionTree

        updated_data = []

        for entry in dataset:
            updated_data.append({
                'angle': entry['angle'],
                'timeInMillisec': entry['timeInMillisec'],
                'start_angle': dataset[0]['angle'],
                'initial_velocity': 0
            })

        updated_data_df = pd.DataFrame(updated_data)
        X_test = updated_data_df.drop(columns=["timeInMillisec"])
        y_test = updated_data_df["timeInMillisec"]

        print(updated_data_df.head())

        # Make predictions using both models on test data
        linear_reg_preds = linear_reg.predict(X_test)
        decision_tree_reg_preds = decision_tree_reg.predict(X_test)

        # Create a dictionary to store model predictions
        predictions_df = ({
            'Linear Regression': linear_reg_preds,
            'Decision Tree': decision_tree_reg_preds,
        })

        # Create a figure and axis for plotting
        plt.figure(figsize=(10, 6))

        # Plot actual values from the test data
        plt.plot(y_test, label='Actual Values',
                 marker='o', linestyle='-', color='b')

        # Plot predictions for each model
        color = ["r", "g", "b"]
        i = 0
        for model, preds in predictions_df.items():
            plt.plot(preds, label=f'{model} Predictions',
                     marker='o', linestyle='-', color=color[i])
            i = i+1

         # Add labels and title to the plot
        plt.xlabel('Data Points')
        plt.ylabel('Values')
        plt.title('Actual vs Predicted Values')
        plt.legend()  # Add legend

        # Save the plot as an image file in the uploads directory
        plt.savefig(os.path.join(UPLOAD_FOLDER, 'actual_vs_predicted.png'))

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

        return "predictions_df_ok"
