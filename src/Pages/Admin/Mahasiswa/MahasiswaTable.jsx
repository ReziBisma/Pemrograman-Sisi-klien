import { useNavigate } from "react-router-dom";
import { useAuthStateContext } from "@/Pages/Auth/AuthContext";
import Button from "@/Pages/Admin/Components/Button";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete, getTotalSks }) => {
  const { user } = useAuthStateContext();
  const navigate = useNavigate();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Max SKS</th>
          <th className="py-2 px-4 text-center">SKS Terpakai</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {mahasiswa.map((mhs, index) => {
          const totalSks = getTotalSks(mhs.id);

          return (
            <tr
              key={mhs.nim}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="py-2 px-4">{mhs.nim}</td>
              <td className="py-2 px-4">{mhs.name}</td>
              <td className="py-2 px-4 text-center">{mhs.max_sks || "-"}</td>
              <td className="py-2 px-4 text-center">{totalSks}</td>
              <td className="py-2 px-4 text-center space-x-2">
                <Button size="sm" onClick={() => navigate(`/admin/mahasiswa/${mhs.id}`)}>
                  Detail
                </Button>

                {user.permission.includes("mahasiswa.update") && (
                  <Button size="sm" variant="warning" onClick={() => openEditModal(mhs)}>
                    Edit
                  </Button>
                )}

                {user.permission.includes("mahasiswa.delete") && (
                  <Button size="sm" variant="danger" onClick={() => onDelete(mhs.id)}>
                    Hapus
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;