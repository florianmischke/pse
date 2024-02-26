from flask import Blueprint, render_template, json, jsonify
import json, re

views = Blueprint('views', __name__)

def clean_css_classes(str):
    return str.replace(',', '')

def format_electronconfig(str):
    return re.sub(r'(\d[spdf])(\d+)', r'\1<sup>\2</sup>', str)

def merge_with_custom(element):    
    with open('website/static/json/elements_custom.json', 'r') as f:
        custom = json.load(f)
        id = element['number']-1
        element['radioactive'] = custom['elements'][id]['radioactive']
        if('hybrid' in custom['elements'][id].keys()):
            element['hybrid'] = custom['elements'][id]['hybrid']
    return element

def data_preparation(data):
    for key in data:
        if(key == 'order'):
            continue
        data[key] = merge_with_custom(data[key])
        data[key]['css_classes'] = clean_css_classes(data[key]['category'])
        data[key]['electron_configuration_formatted'] = format_electronconfig(data[key]['electron_configuration'])
        data[key]['electron_configuration_semantic_formatted'] = format_electronconfig(data[key]['electron_configuration_semantic'])
    return data

@views.route("/")
def home(name='Periodic table of elements'):
    with open('website/static/json/periodic-table-lookup.json', 'r', encoding="utf8") as f:
        data = json.load(f)

    elements = data_preparation(data)

    return render_template('index.html', name=name, elements=elements)