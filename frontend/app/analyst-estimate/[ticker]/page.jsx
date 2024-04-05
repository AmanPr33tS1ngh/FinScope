"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import {useRouter, useSearchParams} from "next/navigation";
import HOSTPORT from "@/env";

const AnalystEstimate = ({params})=>{
    const router = useRouter();

    useEffect(()=>{
        getEstimates();
    }, [])

    const ticker = params.ticker; // AAPL, MSFT, GOOGL
    const searchParams = useSearchParams();
    const recommendation = searchParams.get("recommendation") === "true" || false;

    const [estimates, setEstimates] = useState(null);

    const getEstimates = () => {
        axios.post(`${HOSTPORT}/analyst-estimate/`, {ticker: ticker, recommendation: recommendation}).then((res)=>{
            const response = res.data;
            console.log("response", response);
            setEstimates(response.estimates);
        })
    };

    return (
        <div>{ticker}
             <div className="flex justify-center my-5">
          <div className="flex items-center h-5">
            <input
              id="helper-checkbox"
              aria-describedby="helper-checkbox-text"
              type="checkbox"
              onChange={() => {
                router.push(`/analyst-estimate/${ticker}?recommendation=${!recommendation}`);
              }}
              checked={recommendation}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="ms-2 text-sm">
            <label
              htmlFor="helper-checkbox"
              className="font-medium text-gray-900 dark:text-gray-300"
            >
              Recommendation
            </label>
            <p
              id="helper-checkbox-text"
              className="text-xs font-normal text-gray-500 dark:text-gray-300"
            >
              Recommendation MSG
            </p>
          </div>

        </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Estimated Ebit Avg
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Estimated Ebit High
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Ebit Low
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Ebitda Avg
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Ebitda High
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Ebitda Low
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Eps Avg
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Eps High
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Eps Low
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimated Net Income Avg
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedNetIncomeHigh
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedNetIncomeLow
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedRevenueAvg
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedRevenueHigh
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedRevenueLow
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedSgaExpenseAvg
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedSgaExpenseHigh
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  estimatedSgaExpenseLow
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  numberAnalystEstimatedRevenue
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  numberAnalystsEstimatedEps
                </th>
              </tr>
            </thead>
            <tbody>
              {estimates?.map((estimate, index)=>(
                  <tr index={index}>
                    <td>{estimate.symbol}</td>
                    <td>{estimate.date}</td>
                    <td>{estimate.estimatedEbitAvg}</td>
                    <td>{estimate.estimatedEbitHigh}</td>
                    <td>{estimate.estimatedEbitLow}</td>
                    <td>{estimate.estimatedEbitdaAvg}</td>
                    <td>{estimate.estimatedEbitdaHigh}</td>
                    <td>{estimate.estimatedEbitdaLow}</td>
                    <td>{estimate.estimatedEpsAvg}</td>
                    <td>{estimate.estimatedEpsHigh}</td>
                    <td>{estimate.estimatedEpsLow}</td>
                    <td>{estimate.estimatedNetIncomeAvg}</td>
                    <td>{estimate.estimatedNetIncomeHigh}</td>
                    <td>{estimate.estimatedNetIncomeLow}</td>
                    <td>{estimate.estimatedRevenueAvg}</td>
                    <td>{estimate.estimatedRevenueHigh}</td>
                    <td>{estimate.estimatedRevenueLow}</td>
                    <td>{estimate.estimatedSgaExpenseAvg}</td>
                    <td>{estimate.estimatedSgaExpenseHigh}</td>
                    <td>{estimate.estimatedSgaExpenseLow}</td>
                    <td>{estimate.numberAnalystEstimatedRevenue}</td>
                    <td>{estimate.numberAnalystsEstimatedEps}</td>
                  </tr>
            ))}
            </tbody>
          </table>
        </div>
        </div>
    )
};

export default AnalystEstimate;
