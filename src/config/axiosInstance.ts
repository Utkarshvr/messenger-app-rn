import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://messenger-app-api-vlr1.onrender.com/api",
  // baseURL: "http://192.168.29.190:5000/api",
  // withCredentials: true,
});

export default axiosInstance;
