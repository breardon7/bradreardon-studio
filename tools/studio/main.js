const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')

const PORT = 3001
const PROJECT_ROOT = 'C:/Users/brear/OneDrive/Desktop/Photography/bradreardon-studio'
const PHOTOS_TS = path.join(PROJECT_ROOT, 'content/photos.ts')
const SERIES_TS = path.join(PROJECT_ROOT, 'content/series.ts')
const PUBLIC_IMAGES = path.join(PROJECT_ROOT, 'public/images')

let mainWindow

// ── series.ts helpers ─────────────────────────────────────────────────────────

function readSeriesConfig() {
  if (!fs.existsSync(SERIES_TS)) return {}
  const content = fs.readFileSync(SERIES_TS, 'utf8')
  const result = {}
  const re = /'([^']+)':\s*\{\s*visible:\s*(true|false)\s*\}/g
  let m
  while ((m = re.exec(content)) !== null) {
    result[m[1]] = { visible: m[2] === 'true' }
  }
  return result
}

function writeSeriesConfig(config) {
  const entries = Object.entries(config)
    .map(([k, v]) => "  '" + k + "': { visible: " + v.visible + " },")
    .join('\n')
  const content =
    "export interface SeriesConfig {\n" +
    "  visible: boolean\n" +
    "}\n\n" +
    "export const seriesConfig: Record<string, SeriesConfig> = {\n" +
    entries + "\n" +
    "}\n\n" +
    "export function getVisibleSeries(): string[] {\n" +
    "  return Object.entries(seriesConfig)\n" +
    "    .filter(([, v]) => v.visible)\n" +
    "    .map(([k]) => k)\n" +
    "}\n"
  fs.writeFileSync(SERIES_TS, content, 'utf8')
}

function ensureSeriesInConfig(name) {
  const config = readSeriesConfig()
  if (!config[name]) {
    config[name] = { visible: true }
    writeSeriesConfig(config)
  }
}

// ── photos.ts helpers ─────────────────────────────────────────────────────────

function readAllPhotos() {
  const content = fs.readFileSync(PHOTOS_TS, 'utf8')
  const results = []
  const re = /\{\s*\n([\s\S]*?)\s*\},/g
  let m
  while ((m = re.exec(content)) !== null) {
    const block = m[1]
    const get = (key) => {
      const km = block.match(new RegExp(key + ":\\s*'([^']*)'"))
      return km ? km[1] : null
    }
    const getNum = (key) => {
      const km = block.match(new RegExp(key + ':\\s*(\\d+)'))
      return km ? parseInt(km[1]) : null
    }
    const getBool = (key) => new RegExp(key + ':\\s*true').test(block)
    const slug = get('slug')
    if (!slug) continue
    results.push({
      slug,
      src: get('src'),
      alt: get('alt'),
      title: get('title'),
      series: get('series'),
      aspectRatio: get('aspectRatio'),
      year: getNum('year'),
      cover: getBool('cover'),
      featured: getBool('featured'),
    })
  }
  return results
}

function updatePhotoField(slug, field, value) {
  let content = fs.readFileSync(PHOTOS_TS, 'utf8')
  // Find the photo block by slug
  const slugPattern = "slug: '" + slug + "'"
  const slugIdx = content.indexOf(slugPattern)
  if (slugIdx === -1) throw new Error('Photo not found: ' + slug)

  // Find the enclosing block start/end
  const blockStart = content.lastIndexOf('{', slugIdx)
  const blockEnd = content.indexOf('},', slugIdx) + 2

  let block = content.slice(blockStart, blockEnd)

  if (typeof value === 'boolean') {
    const fieldRe = new RegExp('\\n\\s*' + field + ': true,?')
    if (value) {
      // add if not present
      if (!fieldRe.test(block)) {
        block = block.replace(/(year:\s*\d+,)/, '$1\n    ' + field + ': true,')
      }
    } else {
      // remove if present
      block = block.replace(fieldRe, '')
    }
  }

  content = content.slice(0, blockStart) + block + content.slice(blockEnd)
  fs.writeFileSync(PHOTOS_TS, content, 'utf8')
}

// ── server ────────────────────────────────────────────────────────────────────

function startServer() {
  const server = express()
  const upload = multer({ dest: path.join(PROJECT_ROOT, 'tools/studio/tmp/') })

  server.use(express.json())

  // GET /api/series — all series with visibility
  server.get('/api/series', (req, res) => {
    try {
      const content = fs.readFileSync(PHOTOS_TS, 'utf8')
      const match = content.match(/export const SERIES\s*=\s*\[([\s\S]*?)\]\s*as const/)
      if (!match) return res.json({ series: [], config: {} })
      const series = [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
      const config = readSeriesConfig()
      res.json({ series, config })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // POST /api/series/add
  server.post('/api/series/add', (req, res) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Missing name' })
    try {
      let content = fs.readFileSync(PHOTOS_TS, 'utf8')
      const match = content.match(/export const SERIES\s*=\s*\[([\s\S]*?)\]\s*as const/)
      if (!match) return res.status(500).json({ error: 'Could not find SERIES array' })
      const existing = [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
      if (existing.includes(name)) return res.status(400).json({ error: 'Series already exists' })
      const newBlock = match[0].replace(/\]\s*as const/, "  '" + name + "',\n] as const")
      content = content.replace(match[0], newBlock)
      fs.writeFileSync(PHOTOS_TS, content, 'utf8')
      ensureSeriesInConfig(name)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // POST /api/series/visibility
  server.post('/api/series/visibility', (req, res) => {
    const { name, visible } = req.body
    if (!name || typeof visible !== 'boolean') return res.status(400).json({ error: 'Missing name or visible' })
    try {
      const config = readSeriesConfig()
      config[name] = { visible }
      writeSeriesConfig(config)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // POST /api/upload
  server.post('/api/upload', upload.single('image'), (req, res) => {
    const { series } = req.body
    if (!req.file || !series) return res.status(400).json({ error: 'Missing file or series' })
    const seriesFolder = series.toLowerCase().replace(/\s+/g, '-')
    const destDir = path.join(PUBLIC_IMAGES, seriesFolder)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    const filename = req.file.originalname
    const destPath = path.join(destDir, filename)
    fs.renameSync(req.file.path, destPath)
    res.json({ src: '/images/' + seriesFolder + '/' + filename, filename })
  })

  // POST /api/photos — add new photo
  server.post('/api/photos', (req, res) => {
    const { slug, src, alt, title, series, aspectRatio, year, featured, cover } = req.body
    if (!slug || !src || !title || !series) return res.status(400).json({ error: 'Missing required fields' })
    const entry = '  {\n' +
      "    slug: '" + slug + "',\n" +
      "    src: '" + src + "',\n" +
      "    alt: '" + (alt || title) + "',\n" +
      "    title: '" + title + "',\n" +
      "    series: '" + series + "',\n" +
      "    aspectRatio: '" + (aspectRatio || '2/3') + "',\n" +
      '    year: ' + (year || new Date().getFullYear()) + ',' +
      (featured ? '\n    featured: true,' : '') +
      (cover ? '\n    cover: true,' : '') +
      '\n  },'
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

  // GET /api/photos — all photos with full metadata
  server.get('/api/photos', (req, res) => {
    try {
      res.json({ photos: readAllPhotos() })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // PATCH /api/photos/:slug — update cover or featured
  server.patch('/api/photos/:slug', (req, res) => {
    const { slug } = req.params
    const { field, value } = req.body
    if (!field || typeof value === 'undefined') return res.status(400).json({ error: 'Missing field or value' })
    try {
      updatePhotoField(slug, field, value)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  server.listen(PORT, () => console.log('[studio] server on ' + PORT))
}

// ── window ────────────────────────────────────────────────────────────────────

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 800,
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
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.closeDevTools()
  })
  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(() => {
  app.setAppUserModelId('bradreardon.studio')
  startServer()
  createWindow()
})

app.on('window-all-closed', () => app.quit())
app.on('activate', () => { if (mainWindow === null) createWindow() })
