import axios from "@/Utils/AxiosInstance";

// Ambil semua dosen
export const getAllDosen = async () => {
  const res = await axios.get("/dosen.json");
  const data = res.data
    ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId }))
    : [];
  return { data };
};

// Ambil 1 dosen
export const getDosen = async (id) => {
  const res = await axios.get("/dosen.json");
  const all = res.data ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId })) : [];
  const found = all.find((d) => d.id === id);
  return { data: found };
};

// Tambah dosen
export const storeDosen = (data) => axios.post("/dosen.json", data);

// Update dosen
export const updateDosen = async (id, data) => {
  const res = await axios.get("/dosen.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Dosen tidak ditemukan");
  const [firebaseId] = entry;
  return axios.put(`/dosen/${firebaseId}.json`, data);
};

// Hapus dosen
export const deleteDosen = async (id) => {
  const res = await axios.get("/dosen.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Dosen tidak ditemukan");
  const [firebaseId] = entry;
  return axios.delete(`/dosen/${firebaseId}.json`);
};
