// src/Hooks/UseAxios.js
import axios from "axios";

const UseAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "https://fast-courier-server.vercel.app",
  });

  return axiosInstance;
};

export default UseAxios;