import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://backend-4f33f-default-rtdb.firebaseio.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;