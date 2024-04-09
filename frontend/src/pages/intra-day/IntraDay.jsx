import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ADJ_CLOSE, FIVE_MIN } from "../../constants/Constants";
import axios from "axios";
import _debounce from "lodash/debounce";
import HOSTPORT from "../../env";
import TickerSearch from "../../components/TickerSearch/TickerSearch";
import CandleStick from "../../components/ApexChart/ApexCandleStick/CandleStick";
import { DateRangePicker } from "react-date-range";

const IntraDay = () => {
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [seriesOptions, setSeriesOptions] = useState([ADJ_CLOSE]);
  const [tickers, setTickers] = useState([]);
  const [query, setQuery] = useState("");

  const [intradaySeries, setIntradaySeries] = useState([]);
  const [timeframeOption, setTimeframeOption] = useState(FIVE_MIN);
  const [range, setRange] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });

  let { ticker } = useParams();

  useEffect(() => {
    if (ticker) {
      getIntraDay();
    }
  }, [
    ticker,
    timeframeOption?.value,
    range?.selection?.startDate,
    range?.selection?.endDate,
  ]);

  const navigate = useNavigate();
  const getIntraDay = () => {
    axios
      .post(`${HOSTPORT}/intra-day/`, {
        ticker: ticker,
        timeframe: timeframeOption?.value,
        startDate: range?.selection?.startDate,
        endDate: range?.selection?.endDate,
      })
      .then((res) => {
        const response = res.data;
        console.log("response", response);
        setIntradaySeries(response.intra_day_data);
      });
  };

  const changeTicker = (e) => {
    navigate(`/intra-day/${e?.value}`);
  };

  const changeExchange = (e) => {
    setSelectedExchange(e);
  };

  const getTickers = (query) => {
    const data = {
      // limit: limit,
      query: query,
      exchange: selectedExchange?.label,
    };
    axios.post(`${HOSTPORT}/tickers/`, data).then((res) => {
      const response = res.data;
      setTickers(response.tickers);
    });
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

  const changeSeriesOptions = (e) => {
    setSeriesOptions(e);
  };

  const changeTimeframeOption = (e) => {
    setTimeframeOption(e);
  };

  const handleSelect = (dates) => {
    setRange({ ...range, ...dates });
  };
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
      timeFrameOptions={timeframeOption}
      changeTimeframeOptions={changeTimeframeOption}
      showTimeframeOptions={true}
    >
      <div className=" grid grid-cols-5 items-center gap-5 m-5">
        <div className=" col-span-3">
          <CandleStick data={intradaySeries} />
        </div>
        <div className=" col-span-2 border border-solid border-gray-200 h-fit">
          <DateRangePicker ranges={[range.selection]} onChange={handleSelect} />
        </div>
      </div>
    </TickerSearch>
  );
};

export default IntraDay;
