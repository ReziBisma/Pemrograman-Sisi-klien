import AuthLayout from "../layouts/AuthLayout";
import Form from "../components/molecules/Form";

export default function Login() {
  return (
    <AuthLayout>
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Login</h2>
        <Form />
      </div>
    </AuthLayout>
  );
}