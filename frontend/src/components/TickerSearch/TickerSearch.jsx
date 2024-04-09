import React from "react";
import {
  EXCHANGES,
  SERIES_OPTIONS,
  TIMEFRAME_OPTIONS,
} from "../../constants/Constants";
import Select from "react-select";

const TickerSearch = ({
  children,
  selectedExchange,
  changeExchange,
  ticker,
  tickers,
  changeQuery,
  query,
  changeTicker,
  seriesOptions,
  changeSeriesOptions,
  showSeriesOptions,
  midSection,
  timeFrameOptions,
  changeTimeframeOptions,
  showTimeframeOptions,
}) => {
  return (
    <div>
      <div className="flex justify-evenly items-center mt-5">
        <div className=" w-1/6">
          <Select
            value={selectedExchange}
            onChange={changeExchange}
            options={EXCHANGES.map((exchange) => {
              return { label: exchange, value: exchange };
            })}
            placeholder={"Select exchange..."}
            isSearchable={true}
          />
        </div>

        <div className=" w-1/6">
          <Select
            value={
              ticker
                ? {
                    label: ticker,
                    value: ticker,
                  }
                : null
            }
            onChange={changeTicker}
            options={tickers}
            placeholder={"Select ticker..."}
            onInputChange={changeQuery}
            inputValue={query}
          />
        </div>
      </div>
      {midSection}

      <div className={"w-1/2 m-auto mt-3"}>
        {showSeriesOptions ? (
          <Select
            value={seriesOptions}
            isMulti={true}
            isSearchable={true}
            isClearable={true}
            onChange={changeSeriesOptions}
            options={SERIES_OPTIONS}
            placeholder={"Select to show chart..."}
          />
        ) : showTimeframeOptions ? (
          <Select
            value={timeFrameOptions}
            isSearchable={true}
            onChange={changeTimeframeOptions}
            options={TIMEFRAME_OPTIONS}
            placeholder={"Select timeframe..."}
          />
        ) : null}
      </div>
      {children}
    </div>
  );
};

export default TickerSearch;
