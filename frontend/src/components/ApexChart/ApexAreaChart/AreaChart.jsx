import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({ series, dates }) => {
  const [areaSeries, setAreaSeries] = useState(series);
  useEffect(() => {
    setAreaSeries(series);
  }, [series]);

  return (
    <div id="chart">
      <ReactApexChart
        options={{
          chart: {
            height: 550,
            type: "area",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
            width: 1,
          },
          xaxis: {
            type: "datetime",
            categories: dates,
          },
          tooltip: {
            x: {
              format: "dd MMM yyyy",
            },
          },
        }}
        series={areaSeries}
        type="area"
        height={550}
      />
    </div>
  );
};

export default AreaChart;
