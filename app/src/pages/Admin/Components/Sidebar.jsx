import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Pages/Auth/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  {user.permission.includes("dashboard.page") && (
    <NavLink to="/admin/dashboard">Dashboard</NavLink>
  )}

  {user.permission.includes("mahasiswa.page") && (
    <NavLink to="/admin/mahasiswa">Mahasiswa</NavLink>
  )}
  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin</span>
      </div>
      <nav className="p-4 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🏠</span>
          <span className="menu-text hidden lg:inline">Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/mahasiswa"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🎓</span>
          <span className="menu-text hidden lg:inline">Mahasiswa</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;