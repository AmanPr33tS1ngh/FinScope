"use client"

import {useState, useEffect} from "react";
import axios from 'axios';
import HOSTPORT from "@/env";
import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";

const MarketCap = ({ params })=>{
    const router = useRouter()
    const [limit, setLimit] = useState(null);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [company, setCompany] = useState(null);

    const ticker = params.ticker; // AAPL, MSFT
    const searchParams = useSearchParams();
    const historical = searchParams.get("historical") === "true" || false;

    useEffect(()=>{
        getMarketCap()
    }, [])
    const getMarketCap = ()=>{
        const data = {
            historical : historical,
            ticker : ticker,
            limit : limit,
            start : start,
            end : end,
        }
        axios.post(`${HOSTPORT}/market-cap/`, data).then((res)=>{
            const response = res.data;
            console.log('response', response);
            setCompany(response.company);
        })
    }

    return (
        <div>
            <div>
            Symbol: {company?.symbol}</div>
            <div>
            Date: {company?.date}</div>
            <div>
            Market Capitalization: {company?.marketCap}</div>

        </div>
    )
}
export default MarketCap;
