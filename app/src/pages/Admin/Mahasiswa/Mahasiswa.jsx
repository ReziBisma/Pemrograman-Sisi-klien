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
import MahasiswaTable from "./MahasiswaTable";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate(); 

  
  const fetchMahasiswa = async () => {
    setMahasiswa(mahasiswaList);
  };

  useEffect(() => {
    setTimeout(() => fetchMahasiswa(), 500);
  }, []);

  
const addMahasiswa = (data) => {
  setMahasiswa([...mahasiswa, { ...data, status: true }]);
};


const updateMahasiswa = (nim, data) => {
  setMahasiswa(
    mahasiswa.map((mhs) =>
      mhs.nim === nim ? { ...mhs, ...data } : mhs
    )
  );
};


const deleteMahasiswa = (nim) => {
  setMahasiswa(mahasiswa.filter((mhs) => mhs.nim !== nim));
};

  
  const handleAdd = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  
  const handleEdit = (data) => {
    setSelectedData(data);
    setModalOpen(true);
  };


 const handleDelete = (nim) => {
  confirmDelete(() => {
    deleteMahasiswa(nim);
    toastSuccess("Data berhasil dihapus");
  });
};

  
  const handleSubmit = (formData) => {
  
    if (!formData.nim || !formData.nama) {
      toastError("NIM dan Nama wajib diisi");
      return;
    }

   
    const isDuplicate = mahasiswa.some(
      (mhs) => mhs.nim === formData.nim && mhs !== selectedData
    );

    if (isDuplicate) {
      toastError("NIM sudah terdaftar!");
      return;
    }


    if (selectedData) {
      confirmUpdate(() => {
        updateMahasiswa(selectedData.nim, formData);
        toastSuccess("Data berhasil diperbarui");
        setModalOpen(false);
        setSelectedData(null);
      });
    } 
  
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

      <MahasiswaTable
        data={mahasiswa}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
      />

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