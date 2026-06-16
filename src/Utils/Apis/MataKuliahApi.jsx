import axios from "@/Utils/AxiosInstance";

// Ambil semua mata kuliah
export const getAllMataKuliah = async () => {
  const res = await axios.get("/matakuliah.json");
  const data = res.data
    ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId }))
    : [];
  return { data };
};

// Ambil satu mata kuliah
export const getMataKuliah = async (id) => {
  const res = await axios.get("/matakuliah.json");
  const all = res.data ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId })) : [];
  const found = all.find((m) => m.id === id);
  return { data: found };
};

// Tambah mata kuliah
export const storeMataKuliah = (data) => axios.post("/matakuliah.json", data);

// Update mata kuliah
export const updateMataKuliah = async (id, data) => {
  const res = await axios.get("/matakuliah.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Mata kuliah tidak ditemukan");
  const [firebaseId] = entry;
  return axios.put(`/matakuliah/${firebaseId}.json`, data);
};

// Hapus mata kuliah
export const deleteMataKuliah = async (id) => {
  const res = await axios.get("/matakuliah.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Mata kuliah tidak ditemukan");
  const [firebaseId] = entry;
  return axios.delete(`/matakuliah/${firebaseId}.json`);
};
