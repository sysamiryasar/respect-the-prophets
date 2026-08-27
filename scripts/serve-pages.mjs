/**
 * Serves dist/ exactly the way GitHub Pages will: under /<repo>/, with
 * 404.html as the fallback for unknown paths. Local verification only.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const BASE = process.env.BASE_PATH || '/respect-the-prophets/'
const PORT = Number(process.env.PORT || 5180)
const ROOT = 'dist'
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif',
  '.json': 'application/json', '.woff2': 'font/woff2',
}

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (!p.startsWith(BASE)) {
    res.writeHead(302, { Location: BASE }); return res.end()
  }
  p = p.slice(BASE.length) || 'index.html'
  const file = join(ROOT, p)
  try {
    if ((await stat(file)).isDirectory()) throw new Error('dir')
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' })
    res.end(await readFile(file))
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(await readFile(join(ROOT, '404.html')))
  }
}).listen(PORT, () => console.log(`Pages-style server on http://localhost:${PORT}${BASE}`))
