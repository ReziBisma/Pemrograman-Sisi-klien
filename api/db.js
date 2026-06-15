import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Load fresh setiap request
  const db = require("../db.json");
  const data = JSON.parse(JSON.stringify(db));

  const urlObj = new URL(req.url, "http://localhost");
  const pathParts = urlObj.pathname.replace(/^\/api\//, "").split("/");
  const resource = pathParts[0];
  const id = pathParts[1];

  console.log("resource:", resource);
  console.log("keys in db:", Object.keys(data));

  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found`, keys: Object.keys(data) });
  }

  const collection = data[resource];

  if (req.method === "GET") {
    if (id) {
      const item = collection.find((i) => String(i.id) === String(id));
      return item ? res.json(item) : res.status(404).json({ error: "Not found" });
    }

    const query = Object.fromEntries(urlObj.searchParams.entries());
    let result = collection;
    for (const [key, val] of Object.entries(query)) {
      result = result.filter((i) => String(i[key]) === String(val));
    }
    return res.json(result);
  }

  if (req.method === "POST") {
    const newItem = { ...req.body, id: String(Date.now()) };
    return res.status(201).json(newItem);
  }

  if (req.method === "PUT") {
    const idx = collection.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const updated = { ...collection[idx], ...req.body };
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    const idx = collection.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    return res.json(collection[idx]);
  }

  return res.status(405).json({ error: "Method not allowed" });
}