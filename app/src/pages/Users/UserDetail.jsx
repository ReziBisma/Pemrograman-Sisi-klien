import { useParams, useNavigate } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Detail User</h1>
      <p>ID User: {id}</p>

      <button onClick={() => navigate("/users")}>
        Kembali
      </button>
    </div>
  );
}