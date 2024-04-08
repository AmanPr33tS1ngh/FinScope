import React from "react";
import { EXCHANGES, SERIES_OPTIONS } from "../../constants/Constants";
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
      {showSeriesOptions ? (
        <div className="w-1/2 m-auto">
          <Select
            value={seriesOptions}
            isMulti={true}
            isSearchable={true}
            isClearable={true}
            onChange={changeSeriesOptions}
            options={SERIES_OPTIONS}
            placeholder={"Select to show chart..."}
          />
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default TickerSearch;
