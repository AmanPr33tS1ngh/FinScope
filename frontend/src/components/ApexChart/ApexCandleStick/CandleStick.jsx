import React from "react";
import Chart from "react-apexcharts";

const CandleStick = ({ data }) => {
  const categories = data.map((item) => item.date);
  const series = [
    {
      data: data.map((item) => ({
        x: new Date(item.date).getTime(),
        y: [item.open, item.high, item.low, item.close],
      })),
    },
  ];

  return (
    <Chart
      options={{
        chart: {
          type: "candlestick",
          height: 350,
        },
        xaxis: {
          type: "datetime",
          categories: categories,
        },
      }}
      series={series}
      type="candlestick"
      height={500}
    />
  );
};

export default CandleStick;
