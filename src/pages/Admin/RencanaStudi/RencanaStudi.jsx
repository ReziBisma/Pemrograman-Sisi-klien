import { useState, useEffect} from "react";
import { useAuthStateContext } from "@/Pages/Auth/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";
// import tambahan di bagian atas
import { updateKelas, storeKelas, deleteKelas } from "@/Utils/Apis/KelasApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});

  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    }, []);

    const fetchData = async () => {
    const [resKelas, resDosen, resMahasiswa, resMataKuliah] = await Promise.all([
        getAllKelas(),
        getAllDosen(),
        getAllMahasiswa(),
        getAllMataKuliah(),
    ]);
    setKelas(resKelas.data);
    setDosen(resDosen.data);
    setMahasiswa(resMahasiswa.data);
    setMataKuliah(resMataKuliah.data);
    };
  
  const mataKuliahSudahDipakai = kelas.map(k => k.mata_kuliah_id);
  const mataKuliahBelumAdaKelas = mataKuliah.filter(m => !mataKuliahSudahDipakai.includes(m.id));

  const getMaxSks = (id) => mahasiswa.find(m => m.id === id)?.max_sks || 0;
  const getDosenMaxSks = (id) => dosen.find(d => d.id === id)?.max_sks || 0;  

  // letakkan setelah getDosenMaxSks

const handleAddMahasiswa = async (kelasItem, mhsId) => {
  const matkul = mataKuliah.find(m => m.id === kelasItem.mata_kuliah_id);
  const sks = matkul?.sks || 0;

  const totalSksMahasiswa = kelas
    .filter(k => k.mahasiswa_ids.includes(mhsId))
    .map(k => mataKuliah.find(m => m.id === k.mata_kuliah_id)?.sks || 0)
    .reduce((acc, curr) => acc + curr, 0);

  const maxSks = getMaxSks(mhsId);

  if (totalSksMahasiswa + sks > maxSks) {
    toastError(`SKS melebihi batas maksimal (${maxSks})`);
    return;
  }

  if (kelasItem.mahasiswa_ids.includes(mhsId)) {
    toastError("Mahasiswa sudah terdaftar");
    return;
  }

  const updated = {
    ...kelasItem,
    mahasiswa_ids: [...kelasItem.mahasiswa_ids, mhsId]
  };

  await updateKelas(kelasItem.id, updated);
  toastSuccess("Mahasiswa ditambahkan");
  setSelectedMhs(prev => ({ ...prev, [kelasItem.id]: "" }));
  fetchData();
};

const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
  const updated = {
    ...kelasItem,
    mahasiswa_ids: kelasItem.mahasiswa_ids.filter(id => id !== mhsId)
  };

  await updateKelas(kelasItem.id, updated);
  toastSuccess("Mahasiswa dihapus");
  fetchData();
};

const handleChangeDosen = async (kelasItem) => {
  const dsnId = selectedDsn[kelasItem.id];
  if (!dsnId) return;

  const totalSksDosen = kelas
    .filter(k => k.dosen_id === dsnId)
    .map(k => mataKuliah.find(m => m.id === k.mata_kuliah_id)?.sks || 0)
    .reduce((acc, curr) => acc + curr, 0);

  const kelasSks = mataKuliah.find(m => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
  const maxSks = getDosenMaxSks(dsnId);

  if (totalSksDosen + kelasSks > maxSks) {
    toastError(`Dosen melebihi batas maksimal SKS (${maxSks})`);
    return;
  }

  await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
  toastSuccess("Dosen diperbarui");
  fetchData();
};

const handleDeleteKelas = async (kelasId) => {
  confirmDelete(async () => {
    await deleteKelas(kelasId);
    toastSuccess("Kelas dihapus");
    fetchData();
  });
};

const openAddModal = () => {
  setForm({ mata_kuliah_id: "", dosen_id: "" });
  setIsModalOpen(true);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.mata_kuliah_id || !form.dosen_id) {
    toastError("Form tidak lengkap");
    return;
  }
  await storeKelas({ ...form, mahasiswa_ids: [] });
  setIsModalOpen(false);
  toastSuccess("Kelas ditambahkan");
  fetchData();
};

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
        <Heading as="h2">Rencana Studi</Heading>
        {user.permission.includes("rencana-studi.page") && (
            <Button onClick={openAddModal}>+ Tambah Kelas</Button>
        )}
        </div>

        <TableRencanaStudi
        kelas={kelas}
        mahasiswa={mahasiswa}
        dosen={dosen}
        mataKuliah={mataKuliah}
        selectedMhs={selectedMhs}
        setSelectedMhs={setSelectedMhs}
        selectedDsn={selectedDsn}
        setSelectedDsn={setSelectedDsn}
        handleAddMahasiswa={handleAddMahasiswa}
        handleDeleteMahasiswa={handleDeleteMahasiswa}
        handleChangeDosen={handleChangeDosen}
        handleDeleteKelas={handleDeleteKelas}
        />

        <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChange={handleChange}
        onSubmit={handleSubmit}
        form={form}
        dosen={dosen}
        mataKuliah={mataKuliahBelumAdaKelas}
        />
    </Card>
    );
};

export default RencanaStudi;