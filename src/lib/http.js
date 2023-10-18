import axios from "axios";

function http(options = {}) {
  const http = axios.create({
    baseURL: import.meta.env.VITE_API,
    headers: {
      Accept: "application/json",
      ...options,
    },
  });
  return http;
}

export default http;
