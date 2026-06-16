import axios from "@/Utils/AxiosInstance";

// Ambil semua mahasiswa
export const getAllMahasiswa = async (params = {}) => {
  const res = await axios.get("/mahasiswa.json");
  // Firebase kembalikan object, konversi ke array
  const data = res.data
    ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId }))
    : [];
  return { data };
};

// Ambil 1 mahasiswa by ID
export const getMahasiswa = async (id) => {
  const res = await axios.get("/mahasiswa.json");
  const all = res.data ? Object.entries(res.data).map(([firebaseId, val]) => ({ ...val, firebaseId })) : [];
  const found = all.find((m) => m.id === id || m.firebaseId === id);
  return { data: found };
};

// Tambah mahasiswa
export const storeMahasiswa = (data) => axios.post("/mahasiswa.json", data);

// Update mahasiswa (cari firebaseId dulu)
export const updateMahasiswa = async (id, data) => {
  const res = await axios.get("/mahasiswa.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Mahasiswa tidak ditemukan");
  const [firebaseId] = entry;
  return axios.put(`/mahasiswa/${firebaseId}.json`, data);
};

// Hapus mahasiswa
export const deleteMahasiswa = async (id) => {
  const res = await axios.get("/mahasiswa.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Mahasiswa tidak ditemukan");
  const [firebaseId] = entry;
  return axios.delete(`/mahasiswa/${firebaseId}.json`);
};
