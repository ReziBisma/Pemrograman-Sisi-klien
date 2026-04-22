import { useEffect, useState } from "react";

const MahasiswaModal = ({
  onClose,
  onSubmit,
  initialData, // ✅ samakan dengan parent
}) => {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: true,
  });

  const [error, setError] = useState("");

  // ✅ SET DATA (EDIT / CREATE)
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        nim: "",
        nama: "",
        status: true,
      });
    }
  }, [initialData]);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim || !form.nama) {
      setError("Semua field wajib diisi!");
      return;
    }

    setError("");

    // ❗ hanya kirim data, JANGAN tutup modal di sini
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl shadow-lg p-6">
        
        {/* TITLE */}
        <h2 className="text-xl font-semibold mb-2">
          {initialData ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* NIM */}
          <input
            type="text"
            name="nim"
            placeholder="NIM"
            value={form.nim}
            onChange={handleChange}
            disabled={initialData} // ✅ disable saat edit
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* NAMA */}
          <input
            type="text"
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Simpan
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;