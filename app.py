from flask import Flask, render_template, json, jsonify
import json, re
from pprint import pprint

app = Flask(__name__)

def clean_css_classes(str):
    return str.replace(',', '')

def format_electronconfig(str):
    return re.sub(r'(\d[spdf])(\d+)', r'\1<sup>\2</sup>', str)

def data_preparation(data):
    for key in data:
        if(key == 'order'):
            continue
        data[key]['css_classes'] = clean_css_classes(data[key]['category'])
        data[key]['electron_configuration_formatted'] = format_electronconfig(data[key]['electron_configuration'])
        data[key]['electron_configuration_semantic_formatted'] = format_electronconfig(data[key]['electron_configuration_semantic'])
    return data

@app.route("/")
def home(name=None):
    with open('static/json/periodic-table-lookup.json', 'r', encoding="utf8") as f:
        data = json.load(f)

    elements = data_preparation(data)

    return render_template('index.html', name=name, elements=elements)


app.run(host='localhost', debug=True)