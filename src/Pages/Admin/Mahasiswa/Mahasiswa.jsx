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

import { useAuthStateContext } from "@/Pages/Auth/AuthContext";
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

import { useKelas } from "@/Utils/Hooks/useKelas";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();

  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Query
  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingMahasiswa,
  } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const mahasiswa = result.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

   const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  // Mutation
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();


  useEffect(() => {
    setTimeout(() => fetchData(), 500);
  }, []); 

  const fetchData = async () => {
  const [resKelas, resMahasiswa, resMataKuliah] = await Promise.all([
    getAllKelas(),
    getAllMahasiswa(),
    getAllMataKuliah(),
  ]);
  setKelas(resKelas.data);
  setMahasiswa(resMahasiswa.data);
  setMataKuliah(resMataKuliah.data);
};

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
          id: selectedMahasiswa.id,
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
  const getTotalSks = (mhsId) => {
    return kelas
      .filter(k => k.mahasiswa_ids.includes(mhsId))
      .map(k => mataKuliah.find(mk => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };
  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
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

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari nama/NIM..."
            className="border px-3 py-1 rounded flex-grow"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="name">Sort by Nama</option>
            <option value="nim">Sort by NIM</option>
            <option value="max_sks">Sort by Max SKS</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        {user?.permission?.includes("mahasiswa.read") && (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              kelas={kelas}
              mataKuliah={mataKuliah}
              getTotalSks={getTotalSks} // passing props ke komponen table
              openEditModal={openEditModal}
              onDelete={handleDelete}
              isLoading={isLoadingMahasiswa}
            />

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm">
                Halaman {page} dari {totalPages || 1}
              </p>

              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={page === 1}
                >
                  Prev
                </button>

                <button
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  onClick={handleNext}
                  disabled={page === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            </div>
          </>
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
