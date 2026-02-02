import os
import logging
import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # <-- Das erlaubt deinem Browser den Zugriff

# Logging konfigurieren
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "Nextmove2"),
    "database": os.getenv("DB_NAME", "mariadb"),
}

@app.route('/save_game', methods=['POST'])
def save_game():
    data = request.json
    user_id = data.get('user_id')
    pgn = data.get('pgn')  # Der String mit den Zügen
    gegner = data.get('gegner')
    ergebnis = data.get('ergebnis')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = """INSERT INTO spiele (user_id, gegner_name, ergebnis, pgn_daten) 
                   VALUES (%s, %s, %s, %s)"""
        cursor.execute(query, (user_id, gegner, ergebnis, pgn))
        
        conn.commit()
        return jsonify({"status": "Spiel gespeichert!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_games <int:user_id>', methods=['GET'])
def get_games(user_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = "SELECT * FROM spiele WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        games = cursor.fetchall()
        
        return jsonify({"games": games}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
