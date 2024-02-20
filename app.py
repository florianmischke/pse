from flask import Flask, render_template, json, jsonify
import json
from pprint import pprint

app = Flask(__name__)

@app.route("/")
def home(name=None):
    with open('static/json/periodic-table-lookup.json', 'r', encoding="utf8") as f:
        data = json.load(f)

    return render_template('index.html', name=name, elements=data)


app.run(host='localhost', debug=True)