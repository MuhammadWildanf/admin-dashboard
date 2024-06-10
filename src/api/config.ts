import axios from "axios";
import { getAccessToken } from "../services/auth";
console.log("Base URL:", process.env.REACT_APP_API_URL);
export const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 100000,
});

request.interceptors.request.use(
  (config) => {

    const token = getAccessToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Accept-Language"] = "application/json";
    }
    return config;
  },
  function (error) {
    if (error.response.status === 401) {
      // window.location.reload();
    }

    return error;
  }
);

request.interceptors.response.use(
  (response) => {
    // console.log('Data dari API:', response.data);
    // You can do any post-response actions here if needed
    return response;
  },
  (error) => {
    // Handle response errors here
    if (error.response && error.response.status === 401) {
      const pathname = window.location.href.split("//");
      const currentURL = pathname[1];
      // If the error status is 401 (Unauthorized), reload the page
      if (currentURL.split("/")[2] !== "login") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);
