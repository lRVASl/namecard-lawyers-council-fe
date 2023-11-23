import dayjs from "dayjs";
import { dateTimeFormatBB, dateTimeFormat, defaultDateFormat } from "../configs";
import { differenceInYears } from "date-fns";

export const age = (text: any) => {
  const [day, month, year] = text.split("/");
  const birthDate = new Date(`${year}-${month}-${day}`);
  const dateNow = new Date();
  const age = differenceInYears(dateNow, birthDate);
  return age;
};
export const convertDate = (text: any) => {
  const [day, month, year] = text?.split("/");
  const birthDate = new Date(`${year}-${month}-${day}`);
  return dayjs(birthDate).add(543, "year");
};
export const dateFormatdate = (date: any) => {
  const [day, month, year] = date.split("/");
  const birthDate = new Date(`${year}-${month}-${day}`);
  return birthDate ? dayjs(birthDate).format(defaultDateFormat) : "-";
};
export const dateFormat = (date: string) => (date ? dayjs(date).format(dateTimeFormatBB) : "-");

export const dateFormatTime = (date: string) => (date ? dayjs(date).format(dateTimeFormat) : "-");

export const numberFormat = (n: number): string => (n && !isNaN(n) ? (Math.round(n * 100) / 100).toLocaleString("th-TH") : "-");

export const phoneFormat = (input: any) => {
  if (!input || isNaN(input)) return `input must be a number was sent ${input}`;
  if (typeof input !== "string") input = input.toString();
  if (input.length === 10) {
    return input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (input.length < 10) {
    return "was not supplied enough numbers please pass a 10 digit number";
  } else if (input.length > 10) {
    return "was supplied too many numbers please pass a 10 digit number";
  } else {
    return "something went wrong";
  }
};

// const Formatter = (value: any) => {
//   if (!value) {
//     return "";
//   }
//   const inputValue = value.replace(/\D/g, "");
//   let formattedValue = "";
//   for (let i = 0; i < inputValue.length; i++) {
//     if (i === 1 || i === 6 || i === 12) {
//       formattedValue += "-";
//     }
//     formattedValue += inputValue.charAt(i);
//   }
//   return formattedValue;
// };
