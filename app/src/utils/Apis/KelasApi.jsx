import axios from "@/Utils/AxiosInstance";

export const getAllKelas = () =>
  axios.get("/kelas");