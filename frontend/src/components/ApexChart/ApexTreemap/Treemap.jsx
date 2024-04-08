import React from "react";
import ReactApexChart from "react-apexcharts";

const Treemap = ({ data, title, height }) => {
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={{
            legend: {
              show: false,
            },
            chart: {
              height: height,
              type: "treemap",
            },
            title: {
              text: title,
              align: "center",
            },
          }}
          series={[
            {
              data: data,
            },
          ]}
          type="treemap"
          height={height}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Treemap;
