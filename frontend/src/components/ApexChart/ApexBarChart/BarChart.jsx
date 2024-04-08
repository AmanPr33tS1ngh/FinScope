import React from "react";
import Chart from "react-apexcharts";

const BarChart = ({ data }) => {
  const options = {
    xaxis: {
      categories: data.map((item) => item.date),
    },
    title: {
      text: "Comparison of Estimated EPS with Actual EPS",
      align: "center",
    },
  };

  const series = [
    { name: "Estimated EPS", data: data.map((item) => item.estimatedEpsAvg) },
    {
      name: "Actual EPS",
      data: data.map((item) => item.numberAnalystsEstimatedEps),
    },
  ];

  return <Chart options={options} series={series} type="bar" height={500} />;
};

export default BarChart;
