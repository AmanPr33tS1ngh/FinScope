import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HOSTPORT from "../../env";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LineChart from "../../components/ApexChart/ApexLineChart/LineChart";
import Treemap from "../../components/ApexChart/ApexTreemap/Treemap";
import BarChart from "../../components/ApexChart/ApexBarChart/BarChart";
import { ADJ_CLOSE, SERIES_OPTIONS } from "../../constants/Constants";
import _debounce from "lodash/debounce";
import TickerSearch from "../../components/TickerSearch/TickerSearch";

const AnalystEstimate = () => {
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [seriesOptions, setSeriesOptions] = useState([ADJ_CLOSE]);
  const [tickers, setTickers] = useState([]);
  const [query, setQuery] = useState("");

  let { ticker } = useParams();

  useEffect(() => {
    if (ticker) {
      getEstimates();
    }
  }, [ticker]);

  // useEffect(() => {
  //   changeSeries();
  // }, [seriesOptions, series]);

  const { search } = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(search);
  const recommendation = queryParams.get("recommendation") === "true" || false;

  const [estimates, setEstimates] = useState([]);

  const getEstimates = () => {
    axios
      .post(`${HOSTPORT}/analyst-estimate/`, {
        ticker: ticker,
        recommendation: recommendation,
      })
      .then((res) => {
        const response = res.data;
        console.log("response", response);
        setEstimates(response.estimates);
      });
  };

  const changeSeriesOptions = (e) => {
    setSeriesOptions(e);
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

  const changeTicker = (e) => {
    navigate(`/analyst-estimate/${e?.value}`);
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
      // midSection={
      //   ticker ? (
      //     <div className="mt-5">
      //       <div className="w-[20%] m-5 bg-gray-300 bg-opacity-25 rounded-xl font-sans mx-auto p-2 text-center">
      //         <div className=" text-2xl font-bold text-black opacity-70">
      //           {company?.symbol}
      //         </div>
      //         <div className="font-light text-sm">{company?.marketCap}</div>
      //       </div>
      //     </div>
      //   ) : null
      // }
    >
      {/* {ticker} */}
      <div className="flex justify-center my-5">
        <div className="flex items-center h-5">
          <input
            id="helper-checkbox"
            aria-describedby="helper-checkbox-text"
            type="checkbox"
            onChange={() => {
              navigate(
                `/analyst-estimate/${ticker}?recommendation=${!recommendation}`
              );
            }}
            checked={recommendation}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="ms-2 text-sm">
          <label
            htmlFor="helper-checkbox"
            className="font-medium text-gray-900 dark:text-gray-300"
          >
            Recommendation
          </label>
          <p
            id="helper-checkbox-text"
            className="text-xs font-normal text-gray-500 dark:text-gray-300"
          >
            Recommendation MSG
          </p>
        </div>
      </div>
      <LineChart data={estimates} />
      <Treemap
        data={estimates.map((estimate) => {
          return { x: estimate.date, y: estimate.estimatedRevenueAvg };
        })}
        height={500}
        title={"Revenue Composition"}
      />
      <BarChart data={estimates} />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Name
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Date
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Estimated Ebit Avg
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Estimated Ebit High
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Ebit Low
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Ebitda Avg
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Ebitda High
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Ebitda Low
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Eps Avg
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Eps High
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Eps Low
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimated Net Income Avg
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedNetIncomeHigh
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedNetIncomeLow
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedRevenueAvg
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedRevenueHigh
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedRevenueLow
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedSgaExpenseAvg
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedSgaExpenseHigh
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                estimatedSgaExpenseLow
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                numberAnalystEstimatedRevenue
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                numberAnalystsEstimatedEps
              </th>
            </tr>
          </thead>
          <tbody>
            {estimates?.map((estimate, index) => (
              <tr index={index}>
                <td>{estimate.symbol}</td>
                <td>{estimate.date}</td>
                <td>{estimate.estimatedEbitAvg}</td>
                <td>{estimate.estimatedEbitHigh}</td>
                <td>{estimate.estimatedEbitLow}</td>
                <td>{estimate.estimatedEbitdaAvg}</td>
                <td>{estimate.estimatedEbitdaHigh}</td>
                <td>{estimate.estimatedEbitdaLow}</td>
                <td>{estimate.estimatedEpsAvg}</td>
                <td>{estimate.estimatedEpsHigh}</td>
                <td>{estimate.estimatedEpsLow}</td>
                <td>{estimate.estimatedNetIncomeAvg}</td>
                <td>{estimate.estimatedNetIncomeHigh}</td>
                <td>{estimate.estimatedNetIncomeLow}</td>
                <td>{estimate.estimatedRevenueAvg}</td>
                <td>{estimate.estimatedRevenueHigh}</td>
                <td>{estimate.estimatedRevenueLow}</td>
                <td>{estimate.estimatedSgaExpenseAvg}</td>
                <td>{estimate.estimatedSgaExpenseHigh}</td>
                <td>{estimate.estimatedSgaExpenseLow}</td>
                <td>{estimate.numberAnalystEstimatedRevenue}</td>
                <td>{estimate.numberAnalystsEstimatedEps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TickerSearch>
  );
};

export default AnalystEstimate;
