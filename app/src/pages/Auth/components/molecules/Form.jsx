import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function Form() {
  return (
    <form className="space-y-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button text="Login" />
    </form>
  );
}