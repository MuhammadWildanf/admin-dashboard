import moment from "moment";
import "moment-timezone";

export const parseDate = (date: string, format?: string) => {
  let dateTz = moment.utc(date).tz(moment.tz.guess());
  if (dateTz) {
    return dateTz.format(format ?? "DD MMM YYYY, HH:mm");
  }

  return false;
};

export const getClientTimezone = () => {
  // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZone = moment.tz.guess();
  return timeZone;
};

export const calculateAge = (birthdate: string) => {
  const currentDate = moment();
  const birthdateMoment = moment(birthdate);
  const years = currentDate.diff(birthdateMoment, "years");
  birthdateMoment.add(years, "years"); // Add years to get accurate month calculation
  const months = currentDate.diff(birthdateMoment, "months");
  return `${years} Thn, ${months} Bln`;
};

export const dateFormat = (date: string) => {
  return new Date(date).toLocaleString("en-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  });
};

export const dateOnlyFormat = (date: string) => {
  return new Date(date).toLocaleString("id-ID", { dateStyle: "short" });
};

export const timeOnlyFormat = (date: string) => {
  return new Date(date).toISOString();
};

export const dateFormatInput = (date: string | Date) => {
  return new Date(date).toISOString().split("T")[0];
};

export const timeToHis = (inputTime: any) => {
  if (!inputTime) {
    return null;
  }

  const parts = inputTime.split(".");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]) || 0;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:00`;

  return formattedTime;
};

export const timeToHi = (inputTime: string) => {
  // Parse the input time using Moment.js
  const parsedTime = moment(inputTime, ["HH:mm:ss", "HH:mm"], true);

  // Check if the input was successfully parsed
  if (parsedTime.isValid()) {
    // Format the parsed time in HH:mm format
    return parsedTime.format("HH:mm");
  } else {
    // Handle invalid input
    return "Invalid date";
  }
};
