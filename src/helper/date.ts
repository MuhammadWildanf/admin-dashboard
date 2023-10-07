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
