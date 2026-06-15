import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserForm() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("User:", name);

    navigate("/users");
  };

  return (
    <div>
      <h1>Tambah User</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama user"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}