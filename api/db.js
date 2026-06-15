import { createRequire } from "module";
const require = createRequire(import.meta.url);
const db = require("../db.json");

let data = JSON.parse(JSON.stringify(db)); // in-memory copy

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const path = req.url.replace(/^\/api\//, "").split("?")[0].split("/");
  const resource = path[0];
  const id = path[1];

  if (!data[resource]) {
    return res.status(404).json({ error: "Resource not found" });
  }

  const collection = data[resource];

  if (req.method === "GET") {
    if (id) {
      const item = collection.find((i) => String(i.id) === String(id));
      return item ? res.json(item) : res.status(404).json({ error: "Not found" });
    }
    // support query params (email, dll)
    const query = req.query || {};
    let result = collection;
    for (const [key, val] of Object.entries(query)) {
      result = result.filter((i) => String(i[key]) === String(val));
    }
    return res.json(result);
  }

  if (req.method === "POST") {
    const newItem = { ...req.body, id: String(Date.now()) };
    data[resource].push(newItem);
    return res.status(201).json(newItem);
  }

  if (req.method === "PUT") {
    const idx = collection.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    data[resource][idx] = { ...collection[idx], ...req.body };
    return res.json(data[resource][idx]);
  }

  if (req.method === "DELETE") {
    const idx = collection.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const deleted = data[resource].splice(idx, 1);
    return res.json(deleted[0]);
  }

  return res.status(405).json({ error: "Method not allowed" });
}