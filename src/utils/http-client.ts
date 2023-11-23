import axios from "axios";
import { message } from "antd";
import qs from "qs";

message.config({
  duration: 2,
  maxCount: 3,
});
const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL || ""}`,
});

// Add message dialog here only for development purpose we can disable when ENV = prod later
instance.interceptors.response.use(
  (res) => {
    const { method, url, params } = res.config;
    message.success(`${method?.toUpperCase()} ${url}?${qs.stringify(params)}`);
    return res;
  },
  (err) => {
    message.error(err.response.data.message);
    return Promise.reject(err.response);
  },
);

export const httpClient = instance;
