export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-3 py-2 rounded"
    >
      {text}
    </button>
  );
}