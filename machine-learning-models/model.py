# Import necessary libraries
import os
import sys
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt

# Define the upload folder
UPLOAD_FOLDER = 'uploads'
# Add the current directory to the system path
sys.path.append(os.getcwd())


class Models:
    def __init__(self):
        # Initialize Linear Regression and Logistic Regression models
        self.linear = LinearRegression()
        self.LogisticRegression = LogisticRegression()
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        print("Model created!")

    def model(self, dataset):
        linear_reg = self.linear
        LogisticRegression_reg = self.LogisticRegression

        # Extract training and testing data from the dataset dictionary
        X_train = dataset['X_train']
        y_train = dataset['y_train']
        X_test = dataset['X_test']
        y_test = dataset['y_test']

        # Fit Linear Regression and Logistic Regression models with training data
        linear_reg.fit(X_train, y_train)
        LogisticRegression_reg.fit(X_train, y_train)

        # Make predictions using both models on test data
        linear_reg_preds = linear_reg.predict(X_test)
        LogisticRegression_reg_preds = LogisticRegression_reg.predict(X_test)

        # Create a dictionary to store model predictions
        predictions_df = ({
            'Linear Regression': linear_reg_preds,
            'Logistic Regression': LogisticRegression_reg_preds,
        })

        # Create a figure and axis for plotting
        plt.figure(figsize=(10, 6))

        # Plot actual values from the test data
        plt.plot(y_test, label='Actual Values',
                 marker='o', linestyle='-', color='b')

        # Plot predictions for each model
        for model, preds in predictions_df.items():
            plt.plot(preds, label=f'{model} Predictions',
                     marker='o', linestyle='-')

         # Add labels and title to the plot
        plt.xlabel('Data Points')
        plt.ylabel('Values')
        plt.title('Actual vs Predicted Values')
        plt.legend()  # Add legend

        # Save the plot as an image file in the uploads directory
        plt.savefig(os.path.join(UPLOAD_FOLDER, 'actual_vs_predicted.png'))

        return predictions_df
