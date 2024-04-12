from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import requests
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

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
        start_date = request.json.get('startDate') # 2021-11-10
        end_date = request.json.get('endDate') # 2022-02-01
        date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
        strf_format = "%Y-%m-%d"
        start_date = datetime.strptime(start_date, date_format).strftime(strf_format)
        end_date = datetime.strptime(end_date, date_format).strftime(strf_format)
        
        print('ssss', type(start_date), type(end_date))
        cal_url = request.json.get('calUrl')
        # ticker = request.json.get('ticker') or ''
        key = free_fmp_key
        version = 'v3'
        
        # if cal_url == 'earning_calendar':
        #     ticker = ''
            
        if cal_url == 'earning-calendar-confirmed' or cal_url == 'ipo-calendar-confirmed':
            version = 'v4'
            key = fmp_key

        duration = f'from={start_date}&to={end_date}'

        # urls = [
        #     '/earning_calendar/' # free,
        #     '/historical/earning_calendar/',
        #     '/api/v4/?&apikey=',
        #     '/stock_dividend_calendar=' # free,
        #     '/stock_split_calendar=' # free,
        #     '/api/v4/?&apikey=',
        # ]

        # url = f'{fmp_url}/{version}/{cal_url}{ticker}?{duration}&apikey={key}'
        url = f'{fmp_url}/{version}/{cal_url}?{duration}&apikey={key}'
        
        print('urlllll', url)
        response = get_response(url)

        # print('response', response)
        return jsonify({'success': True, 'calendarData': response})
    except Exception as e:
        print('err', str(e))
        return jsonify({'success': False, 'err': str(e)})


def format_number(number):
    if not number:
        return number
    
    trillion = 1e12
    billion = 1e9
    million = 1e6
    thousand = 1e3

    if number >= trillion:
        return "{:.2f} Trillion".format(number / trillion)
    elif number >= billion:
        return "{:.2f} Billion".format(number / billion)
    elif number >= million:
        return "{:.2f} Million".format(number / million)
    elif number >= thousand:
        return "{:.2f} Thousand".format(number / thousand)
    else:
        return str(number)


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

    market_cap_response = get_response(url)
    if type(market_cap_response) == list:
        market_cap_response = market_cap_response[0]
        
    market_cap_response['marketCap'] = format_number(market_cap_response.get('marketCap'))
    print('market_cap_response', market_cap_response)
    # price_history_url = f'{fmp_url}/v3/historical-price-full/{ticker}?apikey={fmp_key}'
    # price_history_response = get_response(price_history_url)  
    
    data = [ {'date': '2019-04-08', 'open': 49.11, 'high': 50.06, 'low': 49.08, 'close': 50.03, 'adjClose': 48.16, 'volume': 103526800, 'unadjustedVolume': 103526800, 'change': 0.92, 'changePercent': 1.87, 'vwap': 49.72, 'label': 'April 08, 19', 'changeOverTime': 0.0187}]

    price_history = data #price_history_response.get('historical') 

    return jsonify({'success': True, 'company': market_cap_response, 'price_history': price_history,})


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
    
    df = pd.DataFrame(response)
    df['estimatedRevenueLow'] = df['estimatedRevenueLow'] / 1e9
    df['estimatedRevenueHigh'] = df['estimatedRevenueHigh'] / 1e9
    df['estimatedRevenueAvg'] = df['estimatedRevenueAvg'] / 1e9
    df['estimatedEbitdaLow'] = df['estimatedEbitdaLow'] / 1e9
    df['estimatedEbitdaHigh'] = df['estimatedEbitdaHigh'] / 1e9
    df['estimatedNetIncomeLow'] = df['estimatedNetIncomeLow'] / 1e9
    df['estimatedNetIncomeHigh'] = df['estimatedNetIncomeHigh'] / 1e9
    df['estimatedNetIncomeAvg'] = df['estimatedNetIncomeAvg'] / 1e9
    df['estimatedSgaExpenseLow'] = df['estimatedSgaExpenseLow'] / 1e9
    df['estimatedSgaExpenseHigh'] = df['estimatedSgaExpenseHigh'] / 1e9
    df['estimatedSgaExpenseAvg'] = df['estimatedSgaExpenseAvg'] / 1e9
    df['estimatedEbitdaAvg'] = df['estimatedEbitdaAvg'] / 1e9
    df['estimatedEbitAvg'] = df['estimatedEbitAvg'] / 1e9
    
    df.sort_values(by='date',ascending=True, inplace=True)
    df = df.to_dict(orient='records')
    
    return jsonify({'success': True, 'estimates': df})


@app.route("/intra-day/", methods=["POST"])
def get_intra_day():
    ticker = request.json.get('ticker')
    timeframe = request.json.get('timeframe')
    start_date = request.json.get('startDate')
    end_date = request.json.get('endDate')
    
    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    strf_format = "%Y-%m-%d"
    start_date = datetime.strptime(start_date, date_format).strftime(strf_format)
    end_date = datetime.strptime(end_date, date_format).strftime(strf_format)
    
    print(type(start_date), type(end_date), start_date, end_date,)
    url = f'{fmp_url}/v3/historical-chart/{timeframe}/{ticker}?from={start_date}&to={end_date}&apikey={free_fmp_key}'
    print(url)

    response = get_response(url)
    # print('response', response)
    
    return jsonify({'success': True, 'intra_day_data': response})


sent_data = [
  {
    "publishedDate": "2024-04-12T16:22:08.000Z",
    "title": "Worldcoin Introduces Unverify Option for World ID, Enhancing Personal Data Control",
    "image": "https://www.crypto-news-flash.com/wp-content/uploads/2024/01/nexo-1-1.png",
    "site": "crypto-news-flash",
    "text": "Worldcoin has introduced an “unverify” function to help users better manage their data. With this move, implemented based on regulatory scrutiny, WLD has stayed resilient in the green position. Worldcoin, a San Francisco-based iris biometric crypto project recently introduced a new update known as the “unverify” option for World ID. This update, according to Worldcoin, [...]...",
    "url": "https://www.crypto-news-flash.com/worldcoin-introduces-unverify-option-for-world-id-enhancing-personal-data-control/?utm_source=rss&utm_medium=rss&utm_campaign=worldcoin-introduces-unverify-option-for-world-id-enhancing-personal-data-control",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:21:49.000Z",
    "title": "Liquid Restaking Protocol Ether.fi Allocates $500M to Help Secure RedStone’s Data Oracles",
    "image": "https://crypto-economy.com//wp-content/uploads/2024/04/eig-1024x576.jpg",
    "site": "crypto-economy",
    "text": "TL;DR ether.fi closes $500 million deal with RedStone Oracles to support its data oracle services. The agreement means that more than 20,000 node operators will manage RedStone’s validated services. The native eETH token will be used to reinforce the security of the RedStone network. In a significant move within the blockchain ecosystem, ether.fi, a liquid ... Read more...",
    "url": "https://crypto-economy.com/restaking-protocol-ether-fi-allocates-500m/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:20:45.000Z",
    "title": "Enhancing Mina with Recursive zkRollups: A Deep Dive",
    "image": "https://www.cryptonewsz.com/wp-content/uploads/2024/04/Enhancing-Mina-with-Recursive-zkRollups-A-Deep-Dive.png",
    "site": "cryptonewsz",
    "text": "In the realm of blockchain, Mina Protocol stands out since its blockchain is fixed in size, and it is based on the idea of a proving system employing recursive zk-SNARKs. With this method, L1 security is guaranteed, and the synchronization process is rapid as if there were a full node. However, the amount of data …",
    "url": "https://www.cryptonewsz.com/enhancing-mina-with-recursive-zkrollups-a-deep-dive/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:15:36.000Z",
    "title": "DOGE insider tips: Dogecoin price speculation for this halving as new Doge rival emerges",
    "image": "https://cdn-bplcd.nitrocdn.com/yYxFdwLqsIdKMsfCFJkddYGFYoJKEdpp/assets/images/optimized/rev-82ed167/www.cryptonewsz.com/wp-content/uploads/2024/04/Dogecoin-price-speculation-for-this-halving-as-new-Doge-rival-emerges.png",
    "site": "cryptonewsz",
    "text": "Dogecoin (DOGE), the beloved meme-inspired cryptocurrency, is approaching a pivotal moment in its market life: the much-anticipated halving event. This event, expected to cut the reward for mining Dogecoin in half, is set to reshape the coin’s valuation and market dynamics potentially. As investors and enthusiasts brace for impact, a new contender emerges in the …",
    "url": "https://www.cryptonewsz.com/dogecoin-price-speculation-for-this-halving-as-new-doge-rival-emerges/",
    "symbol": "DOGE-USD"
  },
  {
    "publishedDate": "2024-04-12T16:07:19.000Z",
    "title": "Bitcoin sentiment shifting from anticipation to optimism: IntoTheBlock",
    "image": "https://static.cryptobriefing.com/wp-content/uploads/2024/04/12114338/img-JEQLcSqWzm5juiJFc20snjQm-400x228.png",
    "site": "cryptobriefing",
    "text": "Explore how the latest Bitcoin halving is transforming market expectations and miner behaviors, with a focus on scarcity and price trends...",
    "url": "https://cryptobriefing.com/bitcoin-halving-market-shift/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:04:13.000Z",
    "title": "BlackRock’s Bitcoin Fund Surges: Captures 20% of Firm’s Q1 ETF Inflows",
    "image": "https://crypto-economy.com//wp-content/uploads/2024/04/black-1024x576.jpg",
    "site": "crypto-economy",
    "text": "TL;DR BlackRock’s iShares Bitcoin Trust (IBIT) has generated 21% of the firm’s net ETF flows in the first quarter. IBIT, launched on January 11 along with other bitcoin funds, has reached almost $19 billion in assets under management. BlackRock has also ventured into tokenized funds, reflecting its commitment to investment innovation. BlackRock, the world’s largest ... Read more...",
    "url": "https://crypto-economy.com/blackrocks-bitcoin-fund-surges/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:00:44.000Z",
    "title": "Bitcoin Under $70K as Gold Hits Record Highs, Shiba Inu Grows, Spurring Render Rival’s Rise",
    "image": "https://www.crypto-news-flash.com/wp-content/uploads/2024/04/unnamed-2024-04-11T214506.687.jpg",
    "site": "crypto-news-flash",
    "text": "It’s been an eventful past few weeks in the crypto community. Bitcoin, the chief of all cryptocurrencies having set a record all-time high in early March has caused many investors and BTC holders to gain massive profits. What’s more interesting is that Bitcoin and Gold hit the high records on the same day. However, since [...]...",
    "url": "https://www.crypto-news-flash.com/bitcoin-under-70k-as-gold-hits-record-highs-shiba-inu-grows-spurring-render-rivals-rise/?utm_source=rss&utm_medium=rss&utm_campaign=bitcoin-under-70k-as-gold-hits-record-highs-shiba-inu-grows-spurring-render-rivals-rise",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:00:30.000Z",
    "title": "Ethereum Pectra upgrade promises major wallet improvements with EIP 3074 integration",
    "image": "https://cryptoslate.com/wp-content/uploads/2024/04/ethereum-eip3074.jpg",
    "site": "cryptoslate",
    "text": "Ethereum developers are currently deliberating the Pectra upgrade, which is poised to enhance various facets of the blockchain’s functionality. Tim Beiko, the Ethereum Foundation‘s protocol support lead, confirmed the development, revealing that the developers have agreed to include Ethereum Improvement Proposals (EIP) 3074 in the network’s slated overhaul. EIP 3074 EIP 3074 is a pivotal […] The post Ethereum Pectra upgrade promises major wallet improvements with EIP 3074 integration appeared fi...",
    "url": "https://cryptoslate.com/ethereum-pectra-upgrade-promises-major-wallet-improvements-with-eip-3074-integration/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:00:06.000Z",
    "title": "Dogecoin Usurped: These Memecoins Overtake DOGE In Active Trader Count",
    "image": "https://www.newsbtc.com/wp-content/uploads/2024/04/kanchanara-LPKJJ3M87Ho-unsplash.jpg?fit=460%2C306",
    "site": "newsbtc",
    "text": "On-chain data suggests Dogecoin is no longer the dominant meme coin in terms of its weekly active trader count. Here are the coins above it. Dogecoin Has Been Surpassed In Trader Count By Other Memecoins According to data from the market intelligence platform IntoTheBlock, DOG and DEGEN are the two assets that have managed to surpass the original meme-based cryptocurrency in terms of weekly trader count. A “trader” here refers to an investor who has been holding onto their coins since less than...",
    "url": "https://www.newsbtc.com/news/dogecoin/dogecoin-memecoins-doge-active-trader-count/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T16:00:02.000Z",
    "title": "ATOR joins Peaqosystem to boost blockchain interoperability",
    "image": "https://www.cryptonewsz.com/wp-content/uploads/2024/04/ATOR-joins-Peaqosystem-to-boost-blockchain-interoperability.png",
    "site": "cryptonewsz",
    "text": "ATOR, a prominent player in the blockchain space, has announced its integration into the Peaqosystem, a dynamic ecosystem built on the Peaq blockchain protocol. This strategic partnership marks a significant milestone in fostering blockchain interoperability and expanding accessibility to decentralized technology. ATOR became a part of the Peaqosystem to create the biggest DePIN in the …",
    "url": "https://www.cryptonewsz.com/ator-joins-peaqosystem-to-boost-blockchain-interoperability/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T15:56:38.000Z",
    "title": "Pepe Price Poised For 50% Spike Soon : Here’s Why",
    "image": "https://image.coinpedia.org/wp-content/uploads/2024/04/02202054/pepe.webp",
    "site": "coinpedia",
    "text": "The post Pepe Price Poised For 50% Spike Soon : Here’s Why appeared first on Coinpedia Fintech News The long-awaited fourth Bitcoin (BTC) halving, which ushers in the parabolic rally of the crypto bull cycle, will happen next weekend. On-chain data shows more investors are entering the cryptocurrency industry led by Bitcoin which achieved over 370k new non-zero addresses in the past week. As a result, it is safe to assume the meme …",
    "url": "https://coinpedia.org/price-analysis/pepe-price-poised-for-50-spike-soon-heres-why/",
    "symbol": "BTC-USD"
  },
  {
    "publishedDate": "2024-04-12T15:53:20.000Z",
    "title": "Hacker Sentenced to 3 Years in Prison for Stealing Over $12M From Crypto Exchanges",
    "image": "https://www.coindesk.com/resizer/YIevdADNVY34UTVBdbWIdtIASqM=/800x600/cloudfront-us-east-1.images.arcpublishing.com/coindesk/6MLC6M43OZFWTIWOZ54O6UT354.jpg",
    "site": "coindesk",
    "text": "Shakeeb Ahmed, a security engineer who stole over $12 million from two different decentralized cryptocurrency exchanges built on Solana, was sentenced to three years in prison and three years of supervised release by a federal judge on Friday...",
    "url": "https://www.coindesk.com/policy/2024/04/12/hacker-sentenced-to-3-years-in-prison-for-stealing-over-12m-from-crypto-exchanges/?utm_medium=referral&utm_source=rss&utm_campaign=headlines",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T15:52:33.000Z",
    "title": "Terra Luna Classic’s Proposal for a Core Team",
    "image": "https://image.coinpedia.org/wp-content/uploads/2023/11/23140557/Terraform-Labs-15-Million-Boost-to-the-Terra-Ecosystem.jpg",
    "site": "coinpedia",
    "text": "The post Terra Luna Classic’s Proposal for a Core Team appeared first on Coinpedia Fintech News The Terra Luna Classic (LUNC) community is currently engaged in voting on a crucial proposal aimed at establishing a core team responsible for overseeing the chain’s developments and other key decisions. This proposal comes in the wake of the disbandment of the core developer group Joint L1 Task Force (JL1TF) in March. The proposed core …",
    "url": "https://coinpedia.org/news/terra-luna-classics-proposal-for-a-core-team/",
    "symbol": "LUNC-USD"
  },
  {
    "publishedDate": "2024-04-12T15:50:33.000Z",
    "title": "Coinbase Embraces PEPE: Launches Perpetual Futures Amid Meme Coin Craze",
    "image": "https://www.crypto-news-flash.com/wp-content/uploads/2024/03/unnamed-2024-03-20T090826.730.jpg",
    "site": "crypto-news-flash",
    "text": "Coinbase’s decision to introduce PEPE futures on its platforms reflects this trend, allowing investors to speculate on the futures price without directly holding the asset. Despite initial reservations due to its controversial associations, Coinbase’s move to offer PEPE futures signals a shift likely driven by market demand. Amid the strong demand for meme coins currently, [...]...",
    "url": "https://www.crypto-news-flash.com/coinbase-embraces-pepe-launches-perpetual-futures-amid-meme-coin-craze/?utm_source=rss&utm_medium=rss&utm_campaign=coinbase-embraces-pepe-launches-perpetual-futures-amid-meme-coin-craze",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T15:46:49.000Z",
    "title": "Peter Brandt Signals Possible Cardano (ADA) Selloff Before Bullish Rebound ",
    "image": "https://image.coinpedia.org/wp-content/uploads/2023/09/14184115/cardano-Price-Plunge.png",
    "site": "coinpedia",
    "text": "The post Peter Brandt Signals Possible Cardano (ADA) Selloff Before Bullish Rebound appeared first on Coinpedia Fintech News Bitcoin (BTC) dominance has gradually been eating away the altcoin market amid heightened demand from institutional investors. If the Hong Kong regulators approve spot Bitcoin ETFs on Monday as predicted, the flagship coin will most likely rally to a new ATH. As a result, Bitcoin dominance will continue in a rising trajectory, which is not …",
    "url": "https://coinpedia.org/price-analysis/peter-brandt-signals-possible-cardano-ada-selloff-before-bullish-rebound/",
    "symbol": "ADA-USD"
  },
  {
    "publishedDate": "2024-04-12T15:45:14.000Z",
    "title": "Circle deploys USDC smart contract for BlackRock’s BUIDL Fund",
    "image": "https://www.cryptonewsz.com/wp-content/uploads/2024/04/Circle-deploys-USDC-smart-contract-for-BlackRocks-BUIDL-Fund.png",
    "site": "cryptonewsz",
    "text": "Circle, a leading fintech company and issuer of the USDC stablecoin has announced the deployment of a specialized smart contract tailored to investors in BlackRock’s BUIDL Fund. This innovative, intelligent contract solution aims to streamline and automate the transfer process for investors in the BUIDL Fund, providing greater efficiency and transparency in managing their holdings. …",
    "url": "https://www.cryptonewsz.com/circle-deploys-usdc-smart-contract-for-blackrocks-buidl-fund/",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T15:45:00.000Z",
    "title": "Exploring the Legalities of Online Crypto Gambling",
    "image": "https://media.bitrates.com/cache/posts/2613/42668335200-2e62d4066a-c-x300_1px.jpeg?6619580d324d4",
    "site": "bitrates",
    "text": "Cryptocurrency gambling has grown to become the future of the online casino industry, leaving previous standards in the dust...",
    "url": "https://www.bitrates.com/news/p/exploring-the-legalities-of-online-crypto-gambling",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T15:41:08.000Z",
    "title": "What is Block Rewards? A Beginner’s Guide",
    "image": "https://zebpay.com/wp-content/uploads/2022/04/What-is-Block-Rewards.jpg",
    "site": "zebpay",
    "text": "Introduction Blockchain, as the name suggests is made up of chains of various blocks of information and data. The data in the blocks are encrypted and are required to be validated for the transaction to be completed. That validation uses computation power to solve the mathematical problems to facilitate the file transfer of encrypted data. […] The post What is Block Rewards? A Beginner’s Guide appeared first on ZebPay...",
    "url": "https://zebpay.com/blog/what-is-block-rewards",
    "symbol": ""
  },
  {
    "publishedDate": "2024-04-12T15:39:00.000Z",
    "title": "FLOKI (FLOKI) And Bonk (BONK) Investors Target Raboo (RABT) Presale for Massive 100x Gains",
    "image": "https://nulltx.com/wp-content/uploads/2024/04/IMG_20240412_163624_468-800x534.jpg",
    "site": "nulltx",
    "text": "Since its introduction, Raboo, an innovative AI-powered meme coin, has been turning heads as the next 100x crypto. As Raboo gains traction in its ongoing presale, it’s inevitable that underperforming FLOKI (FLOKI) and Bonk (BONK) may lose investors’ interest. What sets Raboo apart and makes it stand out? Join us […]...",
    "url": "https://nulltx.com/floki-floki-and-bonk-bonk-investors-target-raboo-rabt-presale-for-massive-100x-gains/",
    "symbol": "BONK-USD"
  },
  {
    "publishedDate": "2024-04-12T15:35:49.000Z",
    "title": "Ethereum’s Pectra upgrade slated for Q4 2024, bringing smart contract features and improved UX for wallets",
    "image": "https://static.cryptobriefing.com/wp-content/uploads/2024/04/12111922/Ethereum-Pectra-upgrade-400x228.webp",
    "site": "cryptobriefing",
    "text": "Ethereum's Pectra upgrade is coming, and some core smart contract functionalities that would improve UX are expected to boost wallets...",
    "url": "https://cryptobriefing.com/ethereum-pectra-upgrade-smartcontract-functionality-eoa/",
    "symbol": ""
  }
]

def sentiment_score(text, tokenizer, model):
  tokens = tokenizer.encode(text[:512], return_tensors="pt")
  result = model(tokens)
  return int(torch.argmax(result.logits)) + 1

@app.route("/sentiment-analysis/", methods=["POST"])
def sentiment_analysis():
    news_type = request.json.get('news_type')
    version = "v4"
    if news_type == 'stock_news':
        version = 'v3'
        
    url = f'{fmp_url}/{version}/{news_type}?&apikey={fmp_key}'
    print(url)

    # response = get_response(url)
    
    # print('response', response)
    
    df = pd.DataFrame(sent_data) #pd.DataFrame(response)
    
    bert_model = "nlptown/bert-base-multilingual-uncased-sentiment"
    tokenizer = AutoTokenizer.from_pretrained(bert_model)
    model = AutoModelForSequenceClassification.from_pretrained(bert_model)

    # sentiment acc to title 
    df['sentiment'] = df['title'].apply(lambda x: sentiment_score(x, tokenizer, model))
    
    return jsonify({'success': True, 'news_sentiments': df.to_dict(orient="records")})


if __name__ == '__main__':
    app.run(debug=True, port=8080)

