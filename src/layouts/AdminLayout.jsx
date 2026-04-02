import Sidebar from "../components/organisms/Sidebar";
import Header from "../components/organisms/Header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}