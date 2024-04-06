import { useState, useEffect } from "react";
import axios from "axios";
import HOSTPORT from "../../env";
import { useLocation, useParams } from "react-router-dom";
import Search from "../../components/Search/Search";
import Select from "react-select";
import { EXCHANGES } from "../../constants/Constants";
import { useNavigate } from "react-router-dom";

const MarketCap = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [company, setCompany] = useState(null);
  const [tickers, setTickers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedExchange, setSelectedExchange] = useState({
    label: null,
    value: null,
  });

  let { ticker } = useParams();
  console.log(" efft ticker", ticker);

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const historical = queryParams.get("historical") === "true" || false;

  useEffect(() => {
    // console.log("use efft ticker", ticker);
    if (ticker) getMarketCap();
    // else getTickers();
  }, [ticker]);

  const getTickers = () => {
    const data = {
      limit: limit,
      query: query,
      exchange: selectedExchange?.label,
    };
    axios.post(`${HOSTPORT}/tickers/`, data).then((res) => {
      const response = res.data;
      console.log("resss", response);
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
      console.log("response", response);
      setCompany(response.company);
    });
  };

  const changeTicker = (e) => {
    navigate(`/market-cap/${e?.value}`);
  };

  const changeExchange = (e) => {
    setSelectedExchange(e);
  };
  const changeQuery = (e) => {
    setQuery(e.target.value);
  };
  const onSubmit = () => {
    navigate(`/market-cap/${query}`);
  };
  return (
    <div>
      <div className="flex justify-evenly items-center mt-5">
        {/* <div className=" w-1/6">
          <Select
            value={selectedExchange}
            onChange={changeExchange}
            options={EXCHANGES.map((exchange) => {
              return { label: exchange, value: exchange };
            })}
            placeholder={"Select exchange..."}
            isSearchable={true}
          />
        </div> */}
        {/* <Select
        value={{
          label: ticker,
          value: ticker,
        }}
        onChange={changeTicker}
        options={tickers}
        placeholder={"Select ticker..."}
      /> */}
        <div className=" w-3/6">
          <Search
            placeholder={"Enter ticker..."}
            onChange={changeQuery}
            value={query}
            onSubmit={onSubmit}
          />
        </div>
      </div>
      {ticker ? (
        <div className="mt-5">
          <div className=" text-center">Symbol: {company?.symbol}</div>
          <div className=" text-center">Date: {company?.date}</div>
          <div className=" text-center">
            Market Capitalization: {company?.marketCap}
          </div>
        </div>
      ) : (
        "Enter ticker"
      )}
    </div>
  );
};
export default MarketCap;
