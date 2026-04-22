import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mahasiswaList } from "@/Data/Dummy";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import MahasiswaModal from "./MahasiswaModal";
import {
  confirmDelete,
  confirmUpdate,
} from "@/Utils/Helpers/SwalHelpers";

import { toastSuccess } from "@/Utils/Helpers/ToastHelpers";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate(); // ✅ WAJIB

  // ✅ FETCH DATA (SIMULASI API)
  const fetchMahasiswa = async () => {
    setMahasiswa(mahasiswaList);
  };

  useEffect(() => {
    setTimeout(() => fetchMahasiswa(), 500);
  }, []);

  // ✅ CREATE
const addMahasiswa = (data) => {
  setMahasiswa([...mahasiswa, { ...data, status: true }]);
};

// ✅ UPDATE
const updateMahasiswa = (nim, data) => {
  setMahasiswa(
    mahasiswa.map((m) =>
      m.nim === nim ? { ...m, ...data } : m
    )
  );
};

// ✅ DELETE
const deleteMahasiswa = (nim) => {
  setMahasiswa(mahasiswa.filter((m) => m.nim !== nim));
};

  // ✅ TAMBAH
  const handleAdd = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  // ✅ EDIT
  const handleEdit = (data) => {
    setSelectedData(data);
    setModalOpen(true);
  };

  // ✅ DELETE
 const handleDelete = (nim) => {
  confirmDelete(() => {
    deleteMahasiswa(nim);
    toastSuccess("Data berhasil dihapus");
  });
};

  // ✅ SUBMIT (CREATE + UPDATE)
  const handleSubmit = (formData) => {
    // VALIDASI
    if (!formData.nim || !formData.nama) {
      toastError("NIM dan Nama wajib diisi");
      return;
    }

    // CEK DUPLIKAT (kecuali saat edit data yg sama)
    const isDuplicate = mahasiswa.some(
      (m) => m.nim === formData.nim && m !== selectedData
    );

    if (isDuplicate) {
      toastError("NIM sudah terdaftar!");
      return;
    }

    // ✅ UPDATE
    if (selectedData) {
      confirmUpdate(() => {
        updateMahasiswa(selectedData.nim, formData);
        toastSuccess("Data berhasil diperbarui");
        setModalOpen(false);
        setSelectedData(null);
      });
    } 
    // ✅ CREATE
    else {
      addMahasiswa(formData);
      toastSuccess("Data berhasil ditambahkan");
      setModalOpen(false);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2">Daftar Mahasiswa</Heading>
        <Button onClick={handleAdd}>+ Tambah Mahasiswa</Button>
      </div>

      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIM</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-center">Status</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {mahasiswa.map((mhs, index) => (
            <tr
              key={mhs.nim}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="py-2 px-4">{mhs.nim}</td>
              <td className="py-2 px-4">{mhs.nama}</td>

              <td className="py-2 px-4 text-center">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    mhs.status ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {mhs.status ? "Aktif" : "Nonaktif"}
                </span>
              </td>

              <td className="py-2 px-4 text-center space-x-2">
                {/* ✅ DETAIL FIX */}
                <button
                  onClick={() =>
                    navigate(`/admin/mahasiswa/${mhs.nim}`)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Detail
                </button>

                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit(mhs)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(mhs.nim)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ MODAL */}
      {isModalOpen && (
        <MahasiswaModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedData}
        />
      )}
    </Card>
  );
};

export default Mahasiswa;