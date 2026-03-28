const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const multer = require('multer')
const fs = require('fs')

// ── Express server inline ──
const server = express()
const PORT = 3001

const PROJECT_ROOT = 'C:/Users/brear/OneDrive/Desktop/Photography/bradreardon-studio'
const PHOTOS_TS = path.join(PROJECT_ROOT, 'content/photos.ts')
const PUBLIC_IMAGES = path.join(PROJECT_ROOT, 'public/images')

server.use(express.json())

const upload = multer({ dest: path.join(PROJECT_ROOT, 'tools/studio/tmp/') })

server.get('/api/series', (req, res) => {
  try {
    const content = fs.readFileSync(PHOTOS_TS, 'utf8')
    const match = content.match(/export const SERIES\s*=\s*\[([\s\S]*?)\]\s*as const/)
    if (!match) return res.json({ series: [] })
    const series = [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
    res.json({ series })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

server.post('/api/upload', upload.single('image'), (req, res) => {
  const { series } = req.body
  if (!req.file || !series) return res.status(400).json({ error: 'Missing file or series' })

  const seriesFolder = series.toLowerCase().replace(/\s+/g, '-')
  const destDir = path.join(PUBLIC_IMAGES, seriesFolder)

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  const filename = req.file.originalname
  const destPath = path.join(destDir, filename)
  fs.renameSync(req.file.path, destPath)

  res.json({ src: `/images/${seriesFolder}/${filename}`, filename })
})

server.post('/api/photos', (req, res) => {
  const { slug, src, alt, title, series, aspectRatio, year, featured, cover } = req.body
  if (!slug || !src || !title || !series) return res.status(400).json({ error: 'Missing required fields' })

  const entry = `  {
    slug: '${slug}',
    src: '${src}',
    alt: '${alt || title}',
    title: '${title}',
    series: '${series}',
    aspectRatio: '${aspectRatio || '2/3'}',
    year: ${year || new Date().getFullYear()},${featured ? '\n    featured: true,' : ''}${cover ? '\n    cover: true,' : ''}
  },`

  try {
    let content = fs.readFileSync(PHOTOS_TS, 'utf8')
    const insertPoint = content.lastIndexOf(']')
    if (insertPoint === -1) return res.status(500).json({ error: 'Could not find array in photos.ts' })
    content = content.slice(0, insertPoint) + entry + '\n' + content.slice(insertPoint)
    fs.writeFileSync(PHOTOS_TS, content, 'utf8')
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

server.listen(PORT, () => console.log(`Studio API running on ${PORT}`))

// ── Electron window ──
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 860,
    height: 720,
    minWidth: 720,
    minHeight: 600,
    title: 'Brad Reardon · Studio',
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(() => {
  app.setAppUserModelId('bradreardon.studio')
  createWindow()
})

app.on('window-all-closed', () => app.quit())
app.on('activate', () => { if (mainWindow === null) createWindow() })