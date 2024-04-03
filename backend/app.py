from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import requests
load_dotenv()
app = Flask(__name__)

fmp_url = "https://financialmodelingprep.com/api"
fmp_key = os.environ.get("FMP_KEY")

@app.route("/market_broadview/", methods=["GET"])
def get_market_broadview():
    constituent = request.json.get('constituent')
    historical = request.json.get('historical')
    print('ksksk')
    hist = ''
    if historical:
        hist = 'historical/'
        
    url = f'{fmp_url}/{hist}v3/{constituent}_constituent?apikey={fmp_key}'
    response = requests.get(url)
    response = response.json()
    print('response', response)
    return jsonify({'success': True, 'data': response})
    
    
if __name__ == '__main__':
    app.run(debug=True, port=8080)