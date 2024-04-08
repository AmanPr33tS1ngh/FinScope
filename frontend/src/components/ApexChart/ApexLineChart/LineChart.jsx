import React from "react";
import Chart from "react-apexcharts";

const LineChart = ({ data }) => {
  const options = {
    xaxis: {
      categories: data.map((item) => item.date),
    },

    title: {
      text: "Trend (in billions)",
      align: "center",
    },
  };

  const series = [
    { name: "EBIT", data: data.map((item) => item.estimatedEbitAvg) },
    { name: "EBITDA", data: data.map((item) => item.estimatedEbitdaAvg) },
    { name: "EPS", data: data.map((item) => item.estimatedEpsAvg) },
    {
      name: "Net Income",
      data: data.map((item) => item.estimatedNetIncomeAvg),
    },
    { name: "Revenue", data: data.map((item) => item.estimatedRevenueAvg) },
    {
      name: "SGA Expense",
      data: data.map((item) => item.estimatedSgaExpenseAvg),
    },
  ];

  return <Chart options={options} series={series} height={500} type="line" />;
};

export default LineChart;
