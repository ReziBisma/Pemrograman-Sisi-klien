import axios from "@/Utils/AxiosInstance";

// Ambil semua kelas
export const getAllKelas = async () => {
  const res = await axios.get("/kelas.json");

  const data = res.data
    ? Object.entries(res.data).map(
        ([firebaseId, val]) => ({
          firebaseId,
          id: val.id ?? firebaseId,
          mata_kuliah_id: val.mata_kuliah_id || "",
          dosen_id: val.dosen_id || "",
          mahasiswa_ids: val.mahasiswa_ids || [],
        })
      )
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
export const storeKelas = async (data) => {
  const res = await axios.get("/kelas.json");

  const kelas = res.data
    ? Object.values(res.data)
    : [];

  const maxId = Math.max(
    0,
    ...kelas.map((k) => Number(k.id) || 0)
  );

  const newData = {
    id: String(maxId + 1),
    mata_kuliah_id: data.mata_kuliah_id,
    dosen_id: data.dosen_id,
    mahasiswa_ids: data.mahasiswa_ids || [],
  };

  return axios.post("/kelas.json", newData);
};

// Update kelas
export const updateKelas = async (id, data) => {
  const res = await axios.get("/kelas.json");
  const entries = res.data ? Object.entries(res.data) : [];
  const entry = entries.find(([, val]) => val.id === id);
  if (!entry) throw new Error("Kelas tidak ditemukan");
  const [firebaseId] = entry;
  return axios.put(`/kelas/${firebaseId}.json`, {
    ...data,
    mahasiswa_ids: data.mahasiswa_ids || [],
  });
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
