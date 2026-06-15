import { createRequire } from "module";
import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const require = createRequire(import.meta.url);

function loadDb() {
  const dbFolder = join(process.cwd(), "db");
  const files = readdirSync(dbFolder).filter((f) => f.endsWith(".json"));
  const combined = {};
  files.forEach((file) => {
    const key = basename(file, ".json");
    combined[key] = JSON.parse(readFileSync(join(dbFolder, file), "utf-8"));
  });
  return combined;
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const data = loadDb();

  const urlObj = new URL(req.url, "http://localhost");
  const pathParts = urlObj.pathname.replace(/^\/api\//, "").split("/");
  const resource = pathParts[0];
  const id = pathParts[1];

  if (!data[resource]) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
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
    return res.json({ ...collection[idx], ...req.body });
  }

  if (req.method === "DELETE") {
    const idx = collection.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    return res.json(collection[idx]);
  }

  return res.status(405).json({ error: "Method not allowed" });
}