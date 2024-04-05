import { useState, useEffect } from "react";
import axios from "axios";
import HOSTPORT from "../../env";
import { useLocation, useParams } from "react-router-dom";

const MarketCap = () => {
  const [limit, setLimit] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [company, setCompany] = useState(null);

  let { ticker } = useParams();

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const historical = queryParams.get("historical") === "true" || false;

  useEffect(() => {
    getMarketCap();
  }, []);
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

  return (
    <div>
      <div>Symbol: {company?.symbol}</div>
      <div>Date: {company?.date}</div>
      <div>Market Capitalization: {company?.marketCap}</div>
    </div>
  );
};
export default MarketCap;
