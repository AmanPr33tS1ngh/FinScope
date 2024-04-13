import axios from "axios";
import React, { useEffect, useState } from "react";
import HOSTPORT from "../../env";
import Select from "react-select";
import { NEWS_TYPE, STOCK_NEWS } from "../../constants/Constants";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";

const SentimentAnalysis = () => {
  const [selectedType, setSelectedType] = useState(STOCK_NEWS);
  const [sentiments, setSentiments] = useState([]);

  useEffect(() => {
    getSentimentAnalysis();
  }, [selectedType]);

  const getSentimentAnalysis = () => {
    axios
      .post(`${HOSTPORT}/sentiment-analysis/`, {
        news_type: selectedType?.value,
        ticker: "AAPL",
        page: 0,
      })
      .then((res) => {
        const responseData = res.data;
        setSentiments(responseData.news_sentiments);
      });
  };

  const changeType = (e) => {
    setSelectedType(e);
  };

  return (
    <div>
      <div className="flex justify-center p-2">
        <Select
          value={selectedType}
          onChange={changeType}
          options={NEWS_TYPE}
          placeholder={"Select news type..."}
          className=" w-1/4"
          isSearchable={true}
        />
      </div>
      <div className=" flex justify-center items-center m-2">
        <span className=" text-green-400 text-xl">
          Green: Positive Sentiment
        </span>
        &nbsp;&nbsp;||&nbsp;&nbsp;
        <span className=" text-red-400 text-xl">Red: Negative Sentiment</span>
      </div>
      <Table tHeadData={["Index", "Title", "Published Date", "Link"]}>
        {sentiments.map((news, index) => (
          <tr
            className={`my-10 border border-gray-300 rounded-lg ${
              news.sentiment > 2.5
                ? "bg-green-200"
                : news.sentiment < 2.5
                ? "bg-red-200"
                : ""
            }`}
            index={index}
          >
            <td className=" flex justify-center">{index + 1}</td>
            <td>
              <div className="grid grid-cols-12">
                <img class="rounded-full col-span-1" src={news.image} />
                <span className="col-span-11 flex text-center items-center ml-2">
                  {news.title}
                </span>
              </div>
            </td>
            <td>{news.publishedDate}</td>
            <td>
              <Link to={news.url} target="_blank">
                <td className=" cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
                  </svg>
                </td>
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default SentimentAnalysis;
