import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const navigate = useNavigate();

  const [users] = useState([
    { id: 1, name: "Budi" },
    { id: 2, name: "Siti" },
  ]);

  return (
    <div>
      <h1>User List</h1>

      <button onClick={() => navigate("/users/create")}>
        Tambah User
      </button>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => navigate(`/users/${user.id}`)}>
              Detail
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}