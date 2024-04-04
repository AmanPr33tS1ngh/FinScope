"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import HOSTPORT from "@/env";

const Dashboard = ({ slug }) => {
  console.log("slug", slug);
  const router = useRouter();
  const searchParams = useSearchParams();
  const historical = searchParams.get("historical") === "true" || false;
  console.log("historical", historical);
  const [constituents, setConstituents] = useState([]);

  useEffect(() => {
    getConstituent();
  }, [historical]);

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
      });
  };
  return (
    <div>
      <div className="my-2 flex justify-around items-center">
        <button
          onClick={() => router.push("/constituent/sp500")}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 ${
            slug === "sp500" ? "bg-black text-white" : ""
          }`}
        >
          SP500
        </button>
        <button
          onClick={() => router.push("/constituent/nasdaq")}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 ${
            slug === "nasdaq" ? "bg-black text-white" : ""
          }`}
        >
          Nasdaq
        </button>
        <button
          onClick={() => router.push("/constituent/dowjones")}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 ${
            slug === "dowjones" ? "bg-black text-white" : ""
          }`}
        >
          Dow Jones
        </button>
      </div>
      <div>
        <div class="flex justify-center my-5">
          <div class="flex items-center h-5">
            <input
              id="helper-checkbox"
              aria-describedby="helper-checkbox-text"
              type="checkbox"
              onChange={() => {
                router.push(`/constituent/${slug}?historical=${!historical}`);
              }}
              checked={historical}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="ms-2 text-sm">
            <label
              for="helper-checkbox"
              class="font-medium text-gray-900 dark:text-gray-300"
            >
              Historical
            </label>
            <p
              id="helper-checkbox-text"
              class="text-xs font-normal text-gray-500 dark:text-gray-300"
            >
              Historical MSG
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Name
                </th>
                {/* <th scope="col" class="px-6 py-3">
                  Marktet Cap
                </th> */}
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Sub-sector
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Sector
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Headquarter
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Founded
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Added at
                </th>
              </tr>
            </thead>
            <tbody>
              {constituents.map((constituent, index) => (
                <tr index={index}>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    {constituent.name}&nbsp;(<em>{constituent.symbol}</em>)
                  </th>
                  {/* <td class="px-6 py-4">{constituent.marketCap}</td> */}
                  <td class="px-6 py-4">{constituent.subSector}</td>
                  <td class="px-6 py-4">{constituent.sector}</td>
                  <td class="px-6 py-4">{constituent.headQuarter}</td>
                  <td class="px-6 py-4">{constituent.founded}</td>
                  <td class="px-6 py-4">{constituent.dateFirstAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
