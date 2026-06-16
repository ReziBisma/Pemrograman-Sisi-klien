import axios from "@/Utils/AxiosInstance";

// ======================
// GET ALL
// ======================
export const getAllMahasiswa = async () => {
  const res = await axios.get("/mahasiswa.json");

  const data = res.data
    ? Object.entries(res.data).map(
        ([firebaseId, value]) => ({
          firebaseId,
          ...value,
        })
      )
    : [];

  return { data };
};

// ======================
// GET DETAIL
// ======================
export const getMahasiswa = async (id) => {
  const res = await axios.get("/mahasiswa.json");

  const allData = res.data
    ? Object.entries(res.data).map(
        ([firebaseId, value]) => ({
          firebaseId,
          ...value,
        })
      )
    : [];

  const found = allData.find(
    (m) =>
      String(m.id) === String(id) ||
      String(m.firebaseId) === String(id)
  );

  return {
    data: found,
  };
};

// ======================
// STORE
// ======================
export const storeMahasiswa = async (data) => {
  const res = await axios.get("/mahasiswa.json");

  const allData = res.data
    ? Object.values(res.data)
    : [];

  const maxId = Math.max(
    0,
    ...allData.map((m) => Number(m.id) || 0)
  );

  const payload = {
    id: String(maxId + 1),
    nim: data.nim,
    name: data.name,
    max_sks: Number(data.max_sks) || 18,
    status: data.status ?? true,
  };

  return axios.post(
    "/mahasiswa.json",
    payload
  );
};

// ======================
// UPDATE
// ======================
export const updateMahasiswa = async (
  id,
  data
) => {
  const res = await axios.get("/mahasiswa.json");

  const entries = res.data
    ? Object.entries(res.data)
    : [];

  const entry = entries.find(
    ([, value]) =>
      String(value.id) === String(id)
  );

  if (!entry) {
    throw new Error(
      "Mahasiswa tidak ditemukan"
    );
  }

  const [firebaseId] = entry;

  const payload = {
    id: String(id),
    nim: data.nim,
    name: data.name,
    max_sks: Number(data.max_sks),
    status: data.status,
  };

  return axios.put(
    `/mahasiswa/${firebaseId}.json`,
    payload
  );
};

// ======================
// DELETE
// ======================
export const deleteMahasiswa = async (
  id
) => {
  const res = await axios.get("/mahasiswa.json");

  const entries = res.data
    ? Object.entries(res.data)
    : [];

  const entry = entries.find(
    ([, value]) =>
      String(value.id) === String(id)
  );

  if (!entry) {
    throw new Error(
      "Mahasiswa tidak ditemukan"
    );
  }

  const [firebaseId] = entry;

  return axios.delete(
    `/mahasiswa/${firebaseId}.json`
  );
};