import { useState} from "react";
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
import { useAuthStateContext } from "@/Pages/Auth/AuthContext";

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

import { useKelas } from "@/Utils/Hooks/useKelas";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();

  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query
  const { data: mahasiswa = [] } = useMahasiswa();
  const { data: kelas = [] } = useKelas();
  const { data: mataKuliah = [] } = useMataKuliah();

  // Mutation
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (form) => {
    const isEdit = !!selectedMahasiswa;

    if (isEdit) {
      confirmUpdate(() => {
        update({
          id: form.id,
          data: form,
        });

        resetForm();
      });
    } else {
      const exists = mahasiswa.find(
        (m) => m.nim === form.nim
      );

      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }

      store(form);
      resetForm();
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>

          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={openAddModal}>
              + Tambah Mahasiswa
            </Button>
          )}
        </div>

        {user?.permission?.includes("mahasiswa.read") && (
          <MahasiswaTable
            mahasiswa={mahasiswa}
            kelas={kelas}
            mataKuliah={mataKuliah}
            openEditModal={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
        kelas={kelas}
        mataKuliah={mataKuliah}
      />
    </>
  );
};

export default Mahasiswa;