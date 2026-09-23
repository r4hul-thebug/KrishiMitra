import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const frontendDist = path.join(projectRoot, 'frontend', 'dist');
const dist = path.join(projectRoot, 'dist');

if (!fs.existsSync(path.join(frontendDist, 'index.html'))) {
  console.error('[prepare-dist] frontend/dist/index.html not found!');
  process.exit(1);
}

// 1. Clean dist directory completely
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

// 2. Copy all files recursively from frontend/dist to dist
fs.cpSync(frontendDist, dist, { recursive: true });

// 3. Create 404.html SPA fallback in both directories for static hosts
const indexHtmlContent = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8');
fs.writeFileSync(path.join(dist, '404.html'), indexHtmlContent);
fs.writeFileSync(path.join(frontendDist, '404.html'), indexHtmlContent);

console.log('[prepare-dist] Successfully created clean dist with 404.html SPA fallback!');
