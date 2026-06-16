import axios from "@/Utils/AxiosInstance";

export const login = async (email, password) => {
  const res = await axios.get("/user.json");

  // Firebase kembalikan object {0: {...}, 1: {...}}, konversi ke array
  const users = res.data ? Object.values(res.data) : [];

  const user = users.find((u) => u.email === email);

  if (!user) throw new Error("Email tidak ditemukan");
  if (user.password !== password) throw new Error("Password salah");

  return user;
};
