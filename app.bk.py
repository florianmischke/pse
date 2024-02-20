from flask import Flask, render_template, json, jsonify
import json
from pprint import pprint

app = Flask(__name__)

@app.route("/")
def home(name=None):
    with open('static/json/periodic-table-lookup.json', 'r', encoding="utf8") as f:
        data = json.load(f)
    # with open('static/json/elements.json', 'r') as f:
    #     data = json.load(f)
    with open('static/json/elements_custom.json', 'r') as f:
        custom = json.load(f)

    elements = {}
    i = 1
    for x in data:
        elements[i] = x
        elements[i]['radioactive'] = custom['elements'][i-1]['radioactive']
        elements[i]['en_pauling'] = custom['elements'][i-1]['en_pauling']
        elements[i]['css_classes'] = x['category'].replace(',', '')
        if('hybrid' in custom['elements'][i-1].keys()):
            elements[i]['hybrid'] = custom['elements'][i-1]['hybrid']
        period = x['period']
        match period:
            case 1:
                elements[i]['config'] = ""
                group = 1 if x['number'] == 1 else 18
            case 2:
                elements[i]['config'] = "[He] "
                group = x['number']-2 if x['number'] < 5 else x['number'] + 8
            case 3:
                elements[i]['config'] = "[Ne] "
                group = x['number']-10 if x['number'] < 13 else x['number']
            case 4:
                elements[i]['config'] = "[Ar] "
                group = x['number']-18
            case 5:
                elements[i]['config'] = "[Kr] "
                group = x['number']-36
            case 6:
                elements[i]['config'] = "[Xe] "
                group = x['number']-54 if x['number'] < 72 else x['number']-68
            case 7:
                elements[i]['config'] = "[Rn] "
                group = x['number']-86 if x['number'] < 104 else x['number']-100
            case _:
                elements[i]['config'] = ""
                group = 1

        if(x['category'] == 'lanthanide' or x['category'] == 'actinide'):
            elements[i]['group'] = x['category']
        else:
            elements[i]['group'] = group

        match elements[i]['group']:
            case 1|2:
                elements[i]['config'] += str(period) + 's<sup>' + str(elements[i]['shells'][-1]) + '</sup>'
            case 13|14|15|16|17|18:
                elements[i]['config'] += str(period) + 's<sup>2</sup> '
                if(period>5):
                    elements[i]['config'] += str(period-2) +'f<sup>14</sup> '
                if(period>3):
                    elements[i]['config'] += str(period-1) +'d<sup>10</sup> '
                elements[i]['config'] += str(period) + 'p<sup>' + str(elements[i]['shells'][-1]-2) + '</sup>'
            case 3|4|5|6|7|8|9|10|11|12:
                elements[i]['config'] += str(period) + 's<sup>' + str(elements[i]['shells'][-1]) + '</sup> '
                if(period>5):
                    elements[i]['config'] += str(period-2) +'f<sup>14</sup> '
                elements[i]['config'] += str(period-1) + 'd<sup>' + str(elements[i]['shells'][-2]-8) + '</sup> '
            case 'lanthanide'|'actinide':
                elements[i]['config'] += str(period) + 's<sup>' + str(elements[i]['shells'][-1]) + '</sup> '
                if(elements[i]['shells'][-3]-18 != 0):
                    elements[i]['config'] += str(period-2) + 'f<sup>' + str(elements[i]['shells'][-3]-18) + '</sup> '
                if(elements[i]['shells'][-2]-8 != 0):
                    elements[i]['config'] += str(period-1) + 'd<sup>' + str(elements[i]['shells'][-2]-8) + '</sup> '
                elements[i]['config'] += ""
            case _:
                elements[i]['config'] += '?'
        i+=1

    return render_template('index.html', name=name, elements=elements)


app.run(host='localhost', debug=True)