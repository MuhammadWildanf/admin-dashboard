import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment-timezone";
import { getClientTimezone } from "../../helper/date";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(moment());
  const [timezone, setTimezone] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTimezone(getClientTimezone());
    // console.log(new Date());
  }, []);

  useEffect(() => {
    // Update the time every second
    const intervalId = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Format the current time as a string
  const formattedTime = currentTime.format("HH:mm:ss");

  return (
    <div className="text-center leading-4 flex gap-2 items-center">
      <div className="text-2xl font-semibold text-black leading-none w-28 pr-2 border-r">
        {formattedTime}
      </div>
      <div className="leading-none text-black">{timezone}</div>
    </div>
  );
};

export default Clock;
