from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import requests
from flask_cors import CORS
import pandas as pd

load_dotenv()
app = Flask(__name__)
CORS(app)

fmp_url = "https://financialmodelingprep.com/api"
fmp_key = os.environ.get("FMP_KEY")
free_fmp_key = 'bf5ec962f7ea40f40b0dec209cb7713e' #os.environ.get("FREE_FMP_KEY")

def get_response(url):
    response = requests.get(url)
    return response.json()

@app.route("/market-broadview/", methods=["POST"])
def get_market_broadview():
    try:
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
        
        if type(response) == dict:
            return jsonify({"success": False, "constituents": list(), 'fmp_response': response})

        df = pd.DataFrame(response)
        
        sector_counts = df.groupby('sector').size().reset_index(name='count').sort_values(by='count', ascending=False)
        subsector_counts = df.groupby('subSector').size().reset_index(name='count').sort_values(by='count', ascending=False)

        sectors = sector_counts.rename(columns={'sector': 'x', 'count': 'y'}).to_dict(orient='records')
        sub_sectors = subsector_counts.rename(columns={'subSector': 'x', 'count': 'y'}).to_dict(orient='records')

        return jsonify({'success': True, 'constituents': response, 'sectors': sectors, 'sub_sectors': sub_sectors})
    except Exception as e:
        return jsonify({'success': False, 'constituents': list(), 'err': str(e)})
        

@app.route("/tickers/", methods=["POST"])
def get_tickers():
    try:
        query = request.json.get('query') or ''
        if query:
            query = f'query={query}&'
            
        limit = request.json.get('limit') or ''
        if limit:
            limit = f'limit={limit}&'
            
        exchange = request.json.get('exchange') or '&'
        if exchange:
            exchange = f'exchange={exchange}&'
            
        url = f'{fmp_url}/v3/search-ticker?{query}{limit}{exchange}apikey={free_fmp_key}'
        print(url)
        response = get_response(url)
        
        if type(response) == dict:
            return jsonify({"success": False, "tickers": list(), 'fmp_response': response, })

        print('res', response)
        df = pd.DataFrame(response)
        if 'symbol' in df:
            df['label'] = df['symbol']
            df['value'] = df['symbol']
        return jsonify({'success': True, "tickers": df.to_dict(orient='records'), })
    
    except Exception as e:
        print('err', str(e))
        return jsonify({'success': False, 'err': str(e), "tickers": list(), })


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

        url = f'{fmp_url}/{version}/{cal_url}{ticker}?{duration}&apikey={key}'

        response = get_response(url)

        print('response', response)
        return jsonify({'success': True, 'data': response})
    except Exception as e:
        print('err', str(e))
        return jsonify({'success': False, 'err': str(e)})


@app.route("/market-cap/", methods=["POST"])
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

    url = f'{fmp_url}/v3/{cap_url}/{ticker}?{limit}{duration}&apikey={free_fmp_key}'
    print(url)

    response = get_response(url)
    if type(response) == list:
        response = response[0]

    print('response', response)
    return jsonify({'success': True, 'company': response})

@app.route("/analyst-estimate/", methods=["POST"])
def get_analyst_estimate():
    ticker = request.json.get('ticker')
    recommendation = request.json.get('recommendation')

    url = 'analyst-estimates'
    if recommendation:
        url = 'analyst-stock-recommendations'

    url = f'{fmp_url}/v3/{url}/{ticker}?apikey={fmp_key}'
    print(url)

    response = get_response(url)
    print('response', response)

    return jsonify({'success': True, 'estimates': response})


if __name__ == '__main__':
    app.run(debug=True, port=8080)
