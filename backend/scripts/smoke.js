import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

const requiredFiles = [
  "backend/src/server.js",
  "backend/src/routes/userRoutes.js",
  "backend/src/controllers/userController.js",
  "backend/src/models/User.js",
  "frontend/src/App.jsx",
  "frontend/src/main.jsx"
];

const missing = requiredFiles.filter(filePath => {
  const absolutePath = path.join(repoRoot, filePath);
  return !fs.existsSync(absolutePath);
});

if (missing.length) {
  console.error("Smoke test failed. Missing files:");
  missing.forEach(filePath => console.error(`- ${filePath}`));
  process.exit(1);
}

console.log("Smoke test passed.");
