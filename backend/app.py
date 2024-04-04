from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import requests
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

fmp_url = "https://financialmodelingprep.com/api"
fmp_key = os.environ.get("FMP_KEY")
free_fmp_key = os.environ.get("FREE_FMP_KEY")

def get_response(url):
    response = requests.get(url)
    return response.json()

@app.route("/market-broadview/", methods=["POST"])
def get_market_broadview():
    print(1)
    constituent = request.json.get('constituent') # sp500, dowjones, nasdaq
    historical = request.json.get('historical')
    hist = ''
    if historical:
        hist = 'historical/'
        
    key = free_fmp_key
    if constituent == 'sp500':
        key = fmp_key
        
    url = f'{fmp_url}/v3/{hist}{constituent}_constituent?apikey={key}'
    print('url', url)
    response = get_response(url)
    
    return jsonify({'success': True, 'constituents': response})

@app.route("/calendar/", methods=["POST"])
def get_calendar():
    try:
        start_date = request.json.get('start_date') # 2021-11-10
        end_date = request.json.get('end_date') # 2022-02-01
        cal_url = request.json.get('cal_url')
        ticker = request.json.get('ticker') or ''
        key = free_fmp_key
        version = 'v3'

        if cal_url == 'earning-calendar-confirmed' or cal_url == 'ipo-calendar-confirmed':
            version = 'v4'
            key = fmp_key

        duration = ''
        if cal_url != 'earning_calendar':
            duration = f'from={start_date}&to={end_date}'

        # urls = [
        #     '/earning_calendar/' # free,
        #     '/historical/earning_calendar/',
        #     '/api/v4/?&apikey=',
        #     '/stock_dividend_calendar=' # free,
        #     '/stock_split_calendar=' # free,
        #     '/api/v4/?&apikey=',
        # ]

        url = f'{fmp_url}/api/{version}/{cal_url}{ticker}?{duration}&apikey={key}'

        response = get_response(url)

        print('response', response)
        return jsonify({'success': True, 'data': response})
    except Exception as e:
        print('err', str(e))
        return jsonify({'success': False, 'err': str(e)})
    
    
@app.route("/market-cap/", methods=["GET"])
def get_market_cap():
    historical = request.json.get("historical") # bool
    ticker = request.json.get('ticker') # AAPL
    limit_val = request.json.get('limit_val') # 100
    start = request.json.get("start") # 2023-10-10
    end = request.json.get("end") # 2023-10-10

    cap_url = 'market-capitalization'
    limit = duration = ''
    if historical:
        cap_url = 'historical-market-capitalization'
        limit = f'limit={limit_val}&'
        duration = f'from={start}&to={end}'

    url = f'{fmp_url}/api/v3/{cap_url}/{ticker}?{limit}{duration}&apikey={free_fmp_key}'

    response = get_response(url)

    print('response', response)
    return jsonify({'success': True, 'data': response})

@app.route("/analyst-estimate/", methods=["GET"])
def get_analyst_estimate():
    ticker = request.json.get('ticker')
    recommendation = request.json.get('recommendation')

    url = 'analyst-estimates'
    if recommendation:
        url = 'analyst-stock-recommendations'

    url = f'{fmp_url}/api/v3/{url}/{ticker}?apikey={fmp_key}'
    response = get_response(url)

    print('response', response)
    return jsonify({'success': True, 'data': response})


if __name__ == '__main__':
    app.run(debug=True, port=8080)
