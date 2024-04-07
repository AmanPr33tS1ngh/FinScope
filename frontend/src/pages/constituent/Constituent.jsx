import React, { useEffect, useState } from "react";
import axios from "axios";
import HOSTPORT from "../../env";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Treemap from "../../components/ApexChart/ApexTreemap/Treemap";

const Constituent = () => {
  let { slug } = useParams();
  if (!slug) {
    slug = "nasdaq";
  }
  const { search } = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(search);
  const historical = queryParams.get("historical") === "true" || false;
  const [constituents, setConstituents] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [subSectors, setSubSectors] = useState([]);

  useEffect(() => {
    getConstituent();
  }, [historical, slug]);

  const getConstituent = () => {
    axios
      .post(`${HOSTPORT}/market-broadview/`, {
        constituent: slug,
        historical: historical,
      })
      .then((res) => {
        const response = res.data;
        console.log("response", response);
        setConstituents(response.constituents);
        setSectors(response.sectors);
        setSubSectors(response.sub_sectors);
      });
  };

  return (
    <div>
      <div className="my-2 flex justify-around items-center">
        <button
          onClick={() => navigate("/constituent/sp500")}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 ${
            slug === "sp500" ? "bg-black text-white" : ""
          }`}
        >
          SP500
        </button>
        <button
          onClick={() => navigate("/constituent/nasdaq")}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 ${
            slug === "nasdaq" ? "bg-black text-white" : ""
          }`}
        >
          Nasdaq
        </button>
        <button
          onClick={() => navigate("/constituent/dowjones")}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 ${
            slug === "dowjones" ? "bg-black text-white" : ""
          }`}
        >
          Dow Jones
        </button>
      </div>

      <div>
        <div className="flex justify-center my-5">
          <div className="flex items-center h-5">
            <input
              id="helper-checkbox"
              aria-describedby="helper-checkbox-text"
              type="checkbox"
              onChange={() => {
                navigate(`/constituent/${slug}?historical=${!historical}`);
              }}
              checked={historical}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="ms-2 text-sm">
            <label
              htmlFor="helper-checkbox"
              className="font-medium text-gray-900 dark:text-gray-300"
            >
              Historical
            </label>
            <p
              id="helper-checkbox-text"
              className="text-xs font-normal text-gray-500 dark:text-gray-300"
            >
              Historical MSG
            </p>
          </div>
        </div>
      </div>
      <div className="m-5">
        {sectors?.length ? <Treemap data={sectors} height={200} /> : null}
      </div>
      {slug === "sp500" ? (
        <div className="m-5">
          {subSectors?.length ? (
            <Treemap data={subSectors} height={200} />
          ) : null}
        </div>
      ) : null}

      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Sub-sector
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Sector
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Headquarter
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Founded
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Added at
                </th>
              </tr>
            </thead>
            <tbody>
              {constituents?.map((constituent, index) => (
                <tr index={index}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    {constituent.name}&nbsp;(<em>{constituent.symbol}</em>)
                  </th>
                  {/* <td className="px-6 py-4">{constituent.marketCap}</td> */}
                  <td className="px-6 py-4">{constituent.subSector}</td>
                  <td className="px-6 py-4">{constituent.sector}</td>
                  <td className="px-6 py-4">{constituent.headQuarter}</td>
                  <td className="px-6 py-4">{constituent.founded}</td>
                  <td className="px-6 py-4">{constituent.dateFirstAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Constituent;
