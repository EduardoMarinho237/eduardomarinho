import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECTS_DIR = path.join(__dirname, "..", "public", "projects");
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "data",
  "project-manifest.json"
);

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".webp") || file.endsWith(".jpg") || file.endsWith(".png"))
    .filter((file) => file.startsWith("bg-sec"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/bg-sec(\d+)/)?.[1] || "0", 10);
      const numB = parseInt(b.match(/bg-sec(\d+)/)?.[1] || "0", 10);
      return numA - numB;
    });
}

function generateManifest() {
  const manifest = {};

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.warn(`Diretório de projetos não encontrado: ${PROJECTS_DIR}`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    return;
  }

  const projects = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });

  for (const project of projects) {
    if (!project.isDirectory()) continue;

    const projectPath = path.join(PROJECTS_DIR, project.name);
    const abordagens = ["prod", "tec", "pers"];

    manifest[project.name] = {};

    for (const abordagem of abordagens) {
      const abordagemPath = path.join(projectPath, abordagem);
      const images = getImageFiles(abordagemPath);

      manifest[project.name][abordagem] = images.map((file) =>
        `/projects/${project.name}/${abordagem}/${file}`
      );
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Manifesto gerado em: ${OUTPUT_FILE}`);
}

generateManifest();
