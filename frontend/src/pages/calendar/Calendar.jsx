import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import axios from "axios";
import HOSTPORT from "../../env";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";
import { Link, useParams } from "react-router-dom";

const CalendarComponent = () => {
  const { calendarType } = useParams();

  const [range, setRange] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
    compare: {
      startDate: new Date(),
      endDate: new Date(),
      key: "compare",
    },
  });
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    getCalendar();
  }, [range?.selection?.startDate, range?.selection?.endDate, calendarType]);

  const [openDateRangePicker, setOpenDateRangePicker] = useState(false);

  const handleSelect = (dates) => {
    setRange({ ...range, ...dates });
  };

  const getCalendar = () => {
    const data = {
      startDate: range?.selection?.startDate,
      endDate: range?.selection?.endDate,
      calUrl: calendarType,
      ticker: "AAPL",
    };
    axios.post(`${HOSTPORT}/calendar/`, data).then((res) => {
      const response = res.data;
      console.log("response getCalendar", response);
      const calendarData = response.calendarData;
      if (calendarData) {
        setCalendarData(
          calendarData.map((calendar) => {
            return {
              title: calendar.symbol,
              start: new Date(calendar.date),
              end: new Date(calendar.date),
            };
          })
        );
      }
    });
  };
  const changeOpenDateRangePicker = () => {
    setOpenDateRangePicker(!openDateRangePicker);
  };
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };
  return (
    <div className="m-5">
      <div className="flex justify-around items-center">
        <Link
          to={"/calendar/earning_calendar"}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 text-center  ${
            calendarType === "earning_calendar" ? "bg-black text-white" : ""
          }`}
        >
          Earning Calendar
        </Link>
        <Link
          to={"/calendar/stock_dividend_calendar"}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3 text-center  ${
            calendarType === "stock_dividend_calendar"
              ? "bg-black text-white"
              : ""
          }`}
        >
          Stock Dividend Calendar
        </Link>
        <Link
          to={"/calendar/stock_split_calendar"}
          className={`border border-gray-500 border-opacity-25 w-48 rounded-lg py-3  text-center ${
            calendarType === "stock_split_calendar" ? "bg-black text-white" : ""
          }`}
        >
          Stock Split Calendar
        </Link>
      </div>

      <div className=" grid grid-cols-5 items-center gap-5 m-5">
        <div className=" col-span-3">
          <FullCalendar
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            // initialView="dayGridMonth"
            dayMaxEvents={true}
            select={(e) => console.log("select", e)}
            eventContent={renderEventContent}
            eventClick={(e) => console.log("eventClick", e)}
            eventsSet={(e) => console.log("eventsSet", e)}
            // defaultView="dayGridMonth"
            // themeSystem="Simplex"
            // header={{
            //   left: "prev,next",
            //   center: "title",
            //   right: "dayGridMonth,",
            // }}
            plugins={[dayGridPlugin]}
            events={calendarData}
            // displayEventEnd="true"
            // eventColor={"#" + Math.floor(Math.random() * 16777215).toString(16)}
          />
        </div>
        <div className=" col-span-2 border border-solid border-gray-200 h-fit">
          <DateRangePicker ranges={[range.selection]} onChange={handleSelect} />
        </div>
      </div>
    </div>
  );
};
export default CalendarComponent;
