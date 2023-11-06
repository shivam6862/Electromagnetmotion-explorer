from flask import Flask, jsonify, request
from flask_cors import CORS
from model import *
app = Flask(__name__, static_url_path='/uploads', static_folder='uploads')
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/home', methods=['GET'])
def home():
    response_obj = [{
        "message": "successfully run the server."
    }]
    response_headers = {
        "Access-Control-Allow-Origin": "*"
    }
    return jsonify(response_obj), 200, response_headers


@app.route('/generateimage', methods=['POST'])
def generateimage():
    try:
        dataset = request.json.get('dataset')
        print(dataset)

        if not dataset:
            return jsonify({"error": "Missing dataset or file"}), 400

        predictions_dataset = models.model(dataset=dataset)

        response_obj = [{
            "predictions_dataset": predictions_dataset,
            "image_url": "http://localhost:8501/uploads/actual_vs_predicted.png",
            "message": "Predictions saved successfully."
        }]

        response_headers = {
            "Access-Control-Allow-Origin": "*"
        }
        return jsonify(response_obj), 200, response_headers
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred"}), 500


if __name__ == "__main__":
    models = Models()
    app.run(host="localhost", port=8501)

# .\env\Scripts\activate
