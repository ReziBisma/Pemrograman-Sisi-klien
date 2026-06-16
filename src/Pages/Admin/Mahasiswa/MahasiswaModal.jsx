import { useEffect, useState } from "react";
import Button from "@/Pages/Admin/Components/Button";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MahasiswaModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMahasiswa,
}) => {
  const [form, setForm] = useState({
  nim: "",
  name: "",
  max_sks: 18,
  status: true,
});

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim || "",
        name:
          selectedMahasiswa.name ||
          selectedMahasiswa.nama ||
          "",
        max_sks: selectedMahasiswa.max_sks || 18,
        status: selectedMahasiswa.status ?? true,
            });
    } else {
      setForm({
         nim: "",
        name: "",
        max_sks: 18,
        status: true,
      });
    }
  }, [selectedMahasiswa, isModalOpen]);

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : name === "max_sks"
        ? Number(value)
        : value,
  }));
};

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.nim.trim() ||
      !form.name.trim() ||
      !form.max_sks
    ) {
      toastError("Data belum lengkap");
      return;
    }
    onSubmit(form);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedMahasiswa
              ? "Edit Mahasiswa"
              : "Tambah Mahasiswa"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4"
        >

          {/* NIM */}
          <div>
            <Label htmlFor="nim">
              NIM
            </Label>

            <Input
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={!!selectedMahasiswa}
              placeholder="Masukkan NIM"
            />
          </div>

         {/* NAMA */}
        <div>
          <Label htmlFor="name">
            Nama
          </Label>

          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan Nama"
          />
        </div>

        {/* MAX SKS */}
        <div>
          <Label htmlFor="max_sks">
            Max SKS
          </Label>

          <Input
            type="number"
            name="max_sks"
            value={form.max_sks}
            onChange={handleChange}
            min="1"
            max="24"
            placeholder="Masukkan Max SKS"
          />
        </div>

        {/* STATUS */}
        <div>
          <Label>Status</Label>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />

            <span>
              {form.status
                ? "Aktif"
                : "Tidak Aktif"}
            </span>
          </div>
        </div>

          {/* BUTTON */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Batal
            </Button>

            <Button type="submit">
              Simpan
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;