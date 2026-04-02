export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      {children}
    </div>
  );
}