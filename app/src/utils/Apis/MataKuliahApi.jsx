import axios from "@/Utils/AxiosInstance";

export const getAllMataKuliah = () =>
  axios.get("/mataKuliah");