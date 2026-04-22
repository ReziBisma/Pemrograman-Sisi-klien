import { useNavigate } from "react-router-dom";

const MahasiswaTable = ({
  mahasiswa,
  openEditModal,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleDelete = (nim) => {
    onDelete(nim);
  };

  return (
    <table className="w-full text-sm">
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

            <td className="text-center">
              {mhs.status ? "Aktif" : "Nonaktif"}
            </td>

            <td className="text-center space-x-2">
              {/* DETAIL */}
              <button
                onClick={() =>
                  navigate(`/admin/mahasiswa/${mhs.nim}`)
                }
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Detail
              </button>

              {/* EDIT */}
              <button
                onClick={() => openEditModal(mhs)}
                className="bg-yellow-400 px-2 py-1 rounded"
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(mhs.nim)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;