import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";

import {
  confirmDelete,
  confirmUpdate,
} from "@/Utils/Helpers/SwalHelpers";

import {
  toastSuccess,
  toastError,
} from "@/Utils/Helpers/ToastHelpers";

import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      const res = await getAllMahasiswa();
      setMahasiswa(res.data);
    } catch (error) {
      toastError("Gagal mengambil data mahasiswa");
    }
  };

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedMahasiswa) {
        confirmUpdate(async () => {
          try {
            await updateMahasiswa(selectedMahasiswa.id, {
              ...formData,
              id: selectedMahasiswa.id,
            });

            toastSuccess("Data mahasiswa berhasil diperbarui");
            setIsModalOpen(false);
            fetchMahasiswa();
          } catch {
            toastError("Data mahasiswa gagal diperbarui");
          }
        });
      } else {
        await storeMahasiswa(formData);

        toastSuccess("Data mahasiswa berhasil ditambahkan");
        setIsModalOpen(false);
        fetchMahasiswa();
      }
    } catch {
      toastError("Terjadi kesalahan");
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMahasiswa(id);

        toastSuccess("Data mahasiswa berhasil dihapus");
        fetchMahasiswa();
      } catch {
        toastError("Data mahasiswa gagal dihapus");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>

          <Button onClick={openAddModal}>
            + Tambah Mahasiswa
          </Button>
        </div>

        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      </Card>

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </>
  );
};

export default Mahasiswa;