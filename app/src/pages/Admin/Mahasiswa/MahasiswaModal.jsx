import { useState, useEffect } from "react";
import Button from "@/Pages/Admin/Components/Button";

export default function MahasiswaModal({
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: true,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ nim: "", nama: "", status: true });
    }
  }, [initialData]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim || !form.nama) {
      setError("Semua field wajib diisi!");
      return;
    }

    setError("");
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 className="mb-4 text-lg font-bold">
          {initialData ? "Edit" : "Tambah"} Mahasiswa
        </h3>

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* NIM */}
          <input
            type="text"
            name="nim"
            placeholder="NIM"
            value={form.nim}
            onChange={handleChange}
            disabled={initialData}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />

          {/* NAMA */}
          <input
            type="text"
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />

          {/* STATUS */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />
            Aktif
          </label>

          {/* BUTTON */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit">
              Simpan
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}