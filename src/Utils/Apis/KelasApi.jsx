import axios from "@/Utils/AxiosInstance";

// Ambil semua kelas
export const getAllKelas = async () => {
  const res = await axios.get("/kelas.json");
  const data = res.data
    ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId }))
    : [];
  return { data };
};

// Ambil 1 kelas
export const getKelas = async (id) => {
  const res = await axios.get("/kelas.json");
  const all = res.data ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId })) : [];
  const found = all.find((k) => k.id === id);
  return { data: found };
};

// Tambah kelas
export const storeKelas = (data) => axios.post("/kelas.json", data);

// Update kelas
export const updateKelas = async (id, data) => {
  const res = await axios.get("/kelas.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Kelas tidak ditemukan");
  const [firebaseId] = entry;
  return axios.put(`/kelas/${firebaseId}.json`, data);
};

// Hapus kelas
export const deleteKelas = async (id) => {
  const res = await axios.get("/kelas.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Kelas tidak ditemukan");
  const [firebaseId] = entry;
  return axios.delete(`/kelas/${firebaseId}.json`);
};
