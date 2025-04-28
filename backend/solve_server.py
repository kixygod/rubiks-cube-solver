from flask import Flask, request, jsonify
from flask_cors import CORS
import kociemba

app = Flask(__name__)
CORS(app)

@app.route("/solve", methods=["POST"])
def solve():
    data = request.get_json()
    print(f"Received cube data: {data['cube']}")
    try:
        result = kociemba.solve(data["cube"])
        return jsonify({"solution": result})
    except Exception as e:
        print("[ERROR] ", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
