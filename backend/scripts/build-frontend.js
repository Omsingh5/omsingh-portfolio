import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const frontend = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../frontend",
);

if (!existsSync(path.join(frontend, "package.json"))) {
  console.log("Frontend package not found. Skipping portfolio build.");
  process.exit(0);
}

execSync("npm install --include=dev", { cwd: frontend, stdio: "inherit" });
execSync("npm run build", { cwd: frontend, stdio: "inherit" });
