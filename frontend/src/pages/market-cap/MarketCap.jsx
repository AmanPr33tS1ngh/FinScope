import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HOSTPORT from "../../env";
import { useLocation, useParams } from "react-router-dom";
// import Search from "../../components/Search/Search";
import Select from "react-select";
import {
  ADJ_CLOSE,
  EXCHANGES,
  SERIES_OPTIONS,
} from "../../constants/Constants";
import { useNavigate } from "react-router-dom";
import _debounce from "lodash/debounce";
import AreaChart from "../../components/ApexChart/ApexAreaChart/AreaChart";
import TickerSearch from "../../components/TickerSearch/TickerSearch";

const MarketCap = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [company, setCompany] = useState(null);
  const [tickers, setTickers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [companyHistory, setCompanyHistory] = useState([]);
  const [series, setSeries] = useState([]);
  const [seriesOptions, setSeriesOptions] = useState([ADJ_CLOSE]);

  let { ticker } = useParams();

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const historical = queryParams.get("historical") === "true" || false;

  useEffect(() => {
    if (ticker) getMarketCap();
  }, [ticker]);

  useEffect(() => {
    changeSeries();
  }, [seriesOptions, series]);

  const changeSeries = () => {
    const newSeries = [];
    seriesOptions.map((o) => {
      const option = o?.value;
      const name = o?.label;
      SERIES_OPTIONS.map((opt) => {
        if (opt?.value === option) {
          const series = companyHistory.map((history) => {
            return history[option];
          });
          newSeries.push({
            name: name,
            data: series,
          });
        }
      });
    });
    setSeries(newSeries);
  };

  const changeSeriesOptions = (e) => {
    setSeriesOptions(e);
  };

  const getTickers = (query) => {
    const data = {
      limit: limit,
      query: query,
      exchange: selectedExchange?.label,
    };
    axios.post(`${HOSTPORT}/tickers/`, data).then((res) => {
      const response = res.data;
      setTickers(response.tickers);
    });
  };

  const getMarketCap = () => {
    const data = {
      historical: historical,
      ticker: ticker,
      limit: limit,
      start: start,
      end: end,
    };
    axios.post(`${HOSTPORT}/market-cap/`, data).then((res) => {
      const response = res.data;
      setCompany(response.company);
      setCompanyHistory(response.price_history);
    });
  };

  const changeTicker = (e) => {
    navigate(`/market-cap/${e?.value}`);
  };

  const changeExchange = (e) => {
    setSelectedExchange(e);
  };

  const callTickerAPI = _debounce((value) => {
    getTickers(value);
  }, 500);

  const changeQuery = useCallback((e) => {
    setQuery(e);
    if (e) {
      callTickerAPI(e);
    }
  }, []);

  return (
    <TickerSearch
      selectedExchange={selectedExchange}
      changeExchange={changeExchange}
      ticker={ticker}
      tickers={tickers}
      changeQuery={changeQuery}
      query={query}
      changeTicker={changeTicker}
      seriesOptions={seriesOptions}
      changeSeriesOptions={changeSeriesOptions}
      showSeriesOptions={true}
      midSection={
        ticker ? (
          <div className="mt-5">
            <div className="w-[20%] m-5 bg-gray-300 bg-opacity-25 rounded-xl font-sans mx-auto p-2 text-center">
              <div className=" text-2xl font-bold text-black opacity-70">
                {company?.symbol}
              </div>
              <div className="font-light text-sm">{company?.marketCap}</div>
            </div>
          </div>
        ) : null
      }
    >
      {series?.length ? (
        <AreaChart
          dates={companyHistory.map((item) => item.date)}
          series={series}
        />
      ) : null}
    </TickerSearch>
  );
};
export default MarketCap;
