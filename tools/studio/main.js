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

function readFeaturedOrder() {
  if (!fs.existsSync(SERIES_TS)) return []
  const content = fs.readFileSync(SERIES_TS, 'utf8')
  const match = content.match(/export const featuredOrder:\s*string\[\]\s*=\s*\[([\s\S]*?)\]/)
  if (!match) return []
  return [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
}

function readSeriesOrder() {
  if (!fs.existsSync(SERIES_TS)) return {}
  const content = fs.readFileSync(SERIES_TS, 'utf8')
  const match = content.match(/export const seriesOrder:\s*Record<string,\s*string\[\]>\s*=\s*\{([\s\S]*?)\n\}/)
  if (!match) return {}
  const result = {}
  const re = /'([^']+)':\s*\[([\s\S]*?)\]/g
  let m
  while ((m = re.exec(match[1])) !== null) {
    result[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map(x => x[1])
  }
  return result
}

function writeSeriesTS(config, featuredOrder, seriesOrder) {
  const configEntries = Object.entries(config)
    .map(([k, v]) => "  '" + k + "': { visible: " + v.visible + " },")
    .join('\n')

  const featuredEntries = featuredOrder.length
    ? '\n' + featuredOrder.map(s => "  '" + s + "',").join('\n') + '\n'
    : ''

  const seriesOrderEntries = Object.entries(seriesOrder)
    .map(([series, slugs]) => {
      const inner = slugs.length
        ? '\n    ' + slugs.map(s => "'" + s + "'").join(',\n    ') + ',\n  '
        : ''
      return "  '" + series + "': [" + inner + "],"
    })
    .join('\n')

  const content =
    "export interface SeriesConfig {\n" +
    "  visible: boolean\n" +
    "}\n\n" +
    "export const seriesConfig: Record<string, SeriesConfig> = {\n" +
    configEntries + "\n" +
    "}\n\n" +
    "export function getVisibleSeries(): string[] {\n" +
    "  return Object.entries(seriesConfig)\n" +
    "    .filter(([, v]) => v.visible)\n" +
    "    .map(([k]) => k)\n" +
    "}\n\n" +
    "// Slugs of featured photos in homepage display order\n" +
    "export const featuredOrder: string[] = [" + featuredEntries + "]\n\n" +
    "// Per-series photo display order\n" +
    "export const seriesOrder: Record<string, string[]> = {\n" +
    (seriesOrderEntries ? seriesOrderEntries + "\n" : "") +
    "}\n"

  fs.writeFileSync(SERIES_TS, content, 'utf8')
}

function ensureSeriesInConfig(name) {
  const config = readSeriesConfig()
  const order = readFeaturedOrder()
  const seriesOrd = readSeriesOrder()
  if (!config[name]) {
    config[name] = { visible: true }
    writeSeriesTS(config, order, seriesOrd)
  }
}

// ── photos.ts helpers ─────────────────────────────────────────────────────────

function readAllPhotos() {
  const content = fs.readFileSync(PHOTOS_TS, 'utf8')
  const results = []
  // Match array up to closing ] on its own line (stops before helper functions)
  const arrayMatch = content.match(/export const photos[^=]*=\s*\[([\s\S]*?)\n\]/)
  if (!arrayMatch) return results
  const arrayContent = arrayMatch[1]
  const re = /\{([\s\S]*?)\}/g
  let m
  while ((m = re.exec(arrayContent)) !== null) {
    const block = m[1]
    // Try double-quoted first (handles apostrophes in values), fall back to single-quoted
    const get = (key) => {
      let km = block.match(new RegExp(key + ':\\s*"([^"]*)"'))
      if (km) return km[1]
      km = block.match(new RegExp(key + ":\\s*'([^']*)'"))
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
      hidden: getBool('hidden'),
      print: getBool('print'),
    })
  }
  return results
}

function setPhotoBoolean(slug, field, value) {
  let content = fs.readFileSync(PHOTOS_TS, 'utf8')
  const slugIdx = content.indexOf("slug: '" + slug + "'")
  if (slugIdx === -1) throw new Error('Photo not found: ' + slug)
  const blockStart = content.lastIndexOf('{', slugIdx)
  const blockEnd = content.indexOf('},', slugIdx) + 2
  let block = content.slice(blockStart, blockEnd)
  const fieldRe = new RegExp('\\n\\s*' + field + ': true,?')
  if (value) {
    if (!fieldRe.test(block)) {
      block = block.replace(/(year:\s*\d+,)/, '$1\n    ' + field + ': true,')
    }
  } else {
    block = block.replace(fieldRe, '')
  }
  content = content.slice(0, blockStart) + block + content.slice(blockEnd)
  fs.writeFileSync(PHOTOS_TS, content, 'utf8')
}

function clearCoverForSeries(seriesName, exceptSlug) {
  const photos = readAllPhotos()
  photos.forEach(p => {
    if (p.series === seriesName && p.cover && p.slug !== exceptSlug) {
      setPhotoBoolean(p.slug, 'cover', false)
    }
  })
}

function updatePhotoMetadata(slug, fields) {
  let content = fs.readFileSync(PHOTOS_TS, 'utf8')
  const slugIdx = content.indexOf("slug: '" + slug + "'")
  if (slugIdx === -1) throw new Error('Photo not found: ' + slug)
  const blockStart = content.lastIndexOf('{', slugIdx)
  const blockEnd = content.indexOf('},', slugIdx) + 2
  let block = content.slice(blockStart, blockEnd)

  const stringFields = ['title', 'alt', 'series', 'aspectRatio']
  stringFields.forEach(function(field) {
    if (fields[field] !== undefined) {
      block = block.replace(
        new RegExp("(" + field + ":\\s*)'[^']*'"),
        "$1'" + fields[field].replace(/'/g, "\\'") + "'"
      )
    }
  })

  if (fields.year !== undefined) {
    block = block.replace(/(year:\s*)\d+/, '$1' + parseInt(fields.year))
  }

  content = content.slice(0, blockStart) + block + content.slice(blockEnd)
  fs.writeFileSync(PHOTOS_TS, content, 'utf8')
}

function deletePhoto(slug) {
  // 1. Find and remove block from photos.ts
  let content = fs.readFileSync(PHOTOS_TS, 'utf8')
  const slugIdx = content.indexOf("slug: '" + slug + "'")
  if (slugIdx === -1) throw new Error('Photo not found: ' + slug)
  const blockStart = content.lastIndexOf('{', slugIdx)
  const blockEnd = content.indexOf('},', slugIdx) + 2
  const block = content.slice(blockStart, blockEnd)

  // Get src so we can delete the file
  const srcMatch = block.match(/src:\s*'([^']*)'/)
  const src = srcMatch ? srcMatch[1] : null

  content = content.slice(0, blockStart) + content.slice(blockEnd)
  // Clean up any double blank lines left behind
  content = content.replace(/\n{3,}/g, '\n\n')
  fs.writeFileSync(PHOTOS_TS, content, 'utf8')

  // 2. Remove from featuredOrder and seriesOrder in series.ts
  const config = readSeriesConfig()
  const featuredOrd = readFeaturedOrder().filter(s => s !== slug)
  const seriesOrd = readSeriesOrder()
  Object.keys(seriesOrd).forEach(k => {
    seriesOrd[k] = seriesOrd[k].filter(s => s !== slug)
  })
  writeSeriesTS(config, featuredOrd, seriesOrd)

  // 3. Delete image file from public/images/
  if (src) {
    const filePath = path.join(PROJECT_ROOT, 'public', src)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }

  // 4. Remove from prints.ts if listed
  if (fs.existsSync(PRINTS_TS)) {
    const listings = readPrints().filter(l => l.slug !== slug)
    writePrints(listings)
  }
}

function renameSeries(oldName, newName) {
  let content = fs.readFileSync(PHOTOS_TS, 'utf8')
  const seriesBlockMatch = content.match(/export const SERIES\s*=\s*\[([\s\S]*?)\]\s*as const/)
  if (seriesBlockMatch) {
    const newBlock = seriesBlockMatch[0].replace("'" + oldName + "'", "'" + newName + "'")
    content = content.replace(seriesBlockMatch[0], newBlock)
  }
  const photoRe = new RegExp("series: '" + oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "'", 'g')
  content = content.replace(photoRe, "series: '" + newName + "'")
  fs.writeFileSync(PHOTOS_TS, content, 'utf8')

  const config = readSeriesConfig()
  const featuredOrd = readFeaturedOrder()
  const seriesOrd = readSeriesOrder()
  if (config[oldName] !== undefined) {
    config[newName] = config[oldName]
    delete config[oldName]
  }
  if (seriesOrd[oldName] !== undefined) {
    seriesOrd[newName] = seriesOrd[oldName]
    delete seriesOrd[oldName]
  }
  writeSeriesTS(config, featuredOrd, seriesOrd)
}


// ── prints.ts helpers ─────────────────────────────────────────────────────────

const PRINTS_TS = path.join(PROJECT_ROOT, 'content/prints.ts')

function readPrints() {
  if (!fs.existsSync(PRINTS_TS)) return []
  const content = fs.readFileSync(PRINTS_TS, 'utf8')
  const results = []

  // Find the prints array content — stop at ] on its own line
  const arrayMatch = content.match(/export const prints[^=]*=\s*\[([\s\S]*?)\n\]/)
  if (!arrayMatch) return results
  const arrayContent = arrayMatch[1]

  // Match each top-level listing object — greedy match of sizes sub-array included
  const listingRe = /\{([\s\S]*?sizes:\s*\[[\s\S]*?\][\s\S]*?)\}/g
  let m
  while ((m = listingRe.exec(arrayContent)) !== null) {
    const block = m[1]

    const get = (key) => {
      const km = block.match(new RegExp(key + ":\\s*'([^']*)'"))
      return km ? km[1] : ''
    }
    const getBool = (key) => {
      const km = block.match(new RegExp(key + ':\\s*(true|false)'))
      return km ? km[1] === 'true' : false
    }

    const slug = get('slug')
    if (!slug) continue

    // Parse sizes array
    const sizes = []
    const sizesMatch = block.match(/sizes:\s*\[([\s\S]*?)\]/)
    if (sizesMatch) {
      const sizesBlock = sizesMatch[1]
      const sizeRe = /\{([\s\S]*?)\}/g
      let sm
      while ((sm = sizeRe.exec(sizesBlock)) !== null) {
        const sb = sm[1]
        const sget = (key) => { const km = sb.match(new RegExp(key + ":\\s*'([^']*?)'")); return km ? km[1] : '' }
        const sgetNum = (key) => { const km = sb.match(new RegExp(key + ':\\s*(\\d+)')); return km ? parseInt(km[1]) : null }
        const sgetBool = (key) => { const km = sb.match(new RegExp(key + ':\\s*(true|false)')); return km ? km[1] === 'true' : true }
        const label = sget('label')
        if (!label && sgetNum('price') === null) continue
        const size = { label, price: sgetNum('price') || 0, available: sgetBool('available') }
        const edition = sgetNum('edition')
        if (edition) size.edition = edition
        sizes.push(size)
      }
    }

    results.push({ slug, visible: getBool('visible'), priceLine: get('priceLine'), medium: get('medium'), paper: get('paper'), finish: get('finish'), notes: get('notes'), sizes })
  }
  return results
}

function writePrints(listings) {
  const entries = listings.map(function(l) {
    const sizes = (l.sizes || []).map(function(s) {
      return '      {\n' +
        "        label: '" + s.label + "',\n" +
        '        price: ' + s.price + ',\n' +
        (s.edition !== undefined ? '        edition: ' + s.edition + ',\n' : '') +
        '        available: ' + s.available + ',\n' +
        '      }'
    }).join(',\n')

    return '  {\n' +
      "    slug: '" + l.slug + "',\n" +
      '    visible: ' + (l.visible !== false) + ',\n' +
      "    priceLine: '" + (l.priceLine || '').replace(/'/g, "\\'") + "',\n" +
      "    medium: '" + (l.medium || '').replace(/'/g, "\\'") + "',\n" +
      "    paper: '" + (l.paper || '').replace(/'/g, "\\'") + "',\n" +
      "    finish: '" + (l.finish || '').replace(/'/g, "\\'") + "',\n" +
      "    notes: '" + (l.notes || '').replace(/'/g, "\\'") + "',\n" +
      '    sizes: [\n' + sizes + '\n    ],\n' +
      '  }'
  }).join(',\n')

  const out =
    "export interface PrintSize {\n" +
    "  label: string\n" +
    "  price: number\n" +
    "  edition?: number\n" +
    "  available: boolean\n" +
    "}\n\n" +
    "export interface PrintListing {\n" +
    "  slug: string\n" +
    "  visible: boolean\n" +
    "  priceLine: string\n" +
    "  medium: string\n" +
    "  paper: string\n" +
    "  finish: string\n" +
    "  notes: string\n" +
    "  sizes: PrintSize[]\n" +
    "}\n\n" +
    "export const prints: PrintListing[] = [\n" +
    (entries ? entries + '\n' : '') +
    "]\n"

  fs.writeFileSync(PRINTS_TS, out, 'utf8')
}

// ── server ────────────────────────────────────────────────────────────────────

function startServer() {
  const server = express()
  const upload = multer({ dest: path.join(PROJECT_ROOT, 'tools/studio/tmp/') })
  server.use(express.json())

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

  server.post('/api/series/rename', (req, res) => {
    const { oldName, newName } = req.body
    if (!oldName || !newName) return res.status(400).json({ error: 'Missing names' })
    try {
      renameSeries(oldName, newName)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  server.post('/api/series/visibility', (req, res) => {
    const { name, visible } = req.body
    if (!name || typeof visible !== 'boolean') return res.status(400).json({ error: 'Missing name or visible' })
    try {
      const config = readSeriesConfig()
      const featuredOrd = readFeaturedOrder()
      const seriesOrd = readSeriesOrder()
      config[name] = { visible }
      writeSeriesTS(config, featuredOrd, seriesOrd)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // POST /api/series/delete — remove series from SERIES array + seriesConfig
  // Blocked if any photos still belong to this series
  server.post('/api/series/delete', (req, res) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Missing name' })
    try {
      const photos = readAllPhotos()
      const inUse = photos.filter(p => p.series === name)
      if (inUse.length > 0) {
        return res.status(400).json({
          error: 'Cannot delete — ' + inUse.length + ' photo' + (inUse.length > 1 ? 's' : '') + ' still in this series'
        })
      }

      // Remove from SERIES array in photos.ts
      let content = fs.readFileSync(PHOTOS_TS, 'utf8')
      const match = content.match(/export const SERIES\s*=\s*\[([\s\S]*?)\]\s*as const/)
      if (match) {
        const newBlock = match[0].replace(new RegExp("\\s*'" + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "',?"), '')
        content = content.replace(match[0], newBlock)
        fs.writeFileSync(PHOTOS_TS, content, 'utf8')
      }

      // Remove from series.ts config + seriesOrder
      const config = readSeriesConfig()
      const featuredOrd = readFeaturedOrder()
      const seriesOrd = readSeriesOrder()
      delete config[name]
      delete seriesOrd[name]
      writeSeriesTS(config, featuredOrd, seriesOrd)

      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  server.get('/api/featured', (req, res) => {
    try {
      const order = readFeaturedOrder()
      const photos = readAllPhotos()
      const photoMap = {}
      photos.forEach(p => { photoMap[p.slug] = p })
      const ordered = order.filter(slug => photoMap[slug] && photoMap[slug].featured).map(slug => photoMap[slug])
      photos.forEach(p => { if (p.featured && !order.includes(p.slug)) ordered.push(p) })
      res.json({ featured: ordered })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  server.post('/api/featured/reorder', (req, res) => {
    const { order } = req.body
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Missing order array' })
    try {
      const config = readSeriesConfig()
      const seriesOrd = readSeriesOrder()
      writeSeriesTS(config, order, seriesOrd)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  server.get('/api/series-order/:series', (req, res) => {
    try {
      const seriesName = decodeURIComponent(req.params.series)
      const seriesOrd = readSeriesOrder()
      const photos = readAllPhotos().filter(p => p.series === seriesName)
      const order = seriesOrd[seriesName] || []
      const photoMap = {}
      photos.forEach(p => { photoMap[p.slug] = p })
      const seen = new Set()
      const result = []
      order.forEach(slug => { if (photoMap[slug]) { result.push(photoMap[slug]); seen.add(slug) } })
      photos.forEach(p => { if (!seen.has(p.slug)) result.push(p) })
      res.json({ photos: result })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  server.post('/api/series-order/:series', (req, res) => {
    const { order } = req.body
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Missing order array' })
    try {
      const seriesName = decodeURIComponent(req.params.series)
      const config = readSeriesConfig()
      const featuredOrd = readFeaturedOrder()
      const seriesOrd = readSeriesOrder()
      seriesOrd[seriesName] = order
      writeSeriesTS(config, featuredOrd, seriesOrd)
      res.json({ success: true })
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
    fs.renameSync(req.file.path, path.join(destDir, filename))
    res.json({ src: '/images/' + seriesFolder + '/' + filename, filename })
  })

  server.post('/api/photos', (req, res) => {
    const { slug, src, alt, title, series, aspectRatio, year, featured, cover } = req.body
    if (!slug || !src || !title || !series) return res.status(400).json({ error: 'Missing required fields' })
    const existingPhotos = readAllPhotos()
    if (existingPhotos.find(p => p.slug === slug)) return res.status(400).json({ error: 'Slug already exists: ' + slug })
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
      if (insertPoint === -1) return res.status(500).json({ error: 'Could not find array' })
      content = content.slice(0, insertPoint) + entry + '\n' + content.slice(insertPoint)
      fs.writeFileSync(PHOTOS_TS, content, 'utf8')
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  server.get('/api/photos', (req, res) => {
    try {
      res.json({ photos: readAllPhotos() })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // DELETE /api/photos/:slug — remove from photos.ts, series.ts, and disk
  server.delete('/api/photos/:slug', (req, res) => {
    const { slug } = req.params
    try {
      deletePhoto(slug)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // PATCH /api/photos/:slug — update boolean fields (cover, featured)
  server.patch('/api/photos/:slug', (req, res) => {
    const { slug } = req.params
    const { field, value } = req.body
    if (!field || typeof value === 'undefined') return res.status(400).json({ error: 'Missing field or value' })
    try {
      if (field === 'cover' && value === true) {
        const photos = readAllPhotos()
        const photo = photos.find(p => p.slug === slug)
        if (photo) clearCoverForSeries(photo.series, slug)
      }
      setPhotoBoolean(slug, field, value)
      if (field === 'featured') {
        const featuredOrd = readFeaturedOrder()
        const config = readSeriesConfig()
        const seriesOrd = readSeriesOrder()
        if (value && !featuredOrd.includes(slug)) featuredOrd.push(slug)
        else if (!value) {
          const idx = featuredOrd.indexOf(slug)
          if (idx !== -1) featuredOrd.splice(idx, 1)
        }
        writeSeriesTS(config, featuredOrd, seriesOrd)
      }
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // PUT /api/photos/:slug — update metadata fields
  server.put('/api/photos/:slug', (req, res) => {
    const { slug } = req.params
    const { title, alt, series, aspectRatio, year } = req.body
    try {
      updatePhotoMetadata(slug, { title, alt, series, aspectRatio, year })
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  // ── prints routes ───────────────────────────────────────────────────────────

  // GET /api/prints
  server.get('/api/prints', (req, res) => {
    try { res.json({ prints: readPrints() }) }
    catch (e) { res.status(500).json({ error: e.message }) }
  })

  // PUT /api/prints/:slug — create or fully replace a listing
  server.put('/api/prints/:slug', (req, res) => {
    const { slug } = req.params
    const { visible, medium, paper, finish, notes, sizes } = req.body
    try {
      const listings = readPrints()
      const idx = listings.findIndex(l => l.slug === slug)
      const updated = { slug, visible: visible !== false, medium: medium || '', paper: paper || '', finish: finish || '', notes: notes || '', sizes: sizes || [] }
      if (idx !== -1) listings[idx] = updated
      else listings.push(updated)
      writePrints(listings)
      res.json({ success: true })
    } catch (e) { res.status(500).json({ error: e.message }) }
  })

  // PATCH /api/prints/:slug — update individual fields
  server.patch('/api/prints/:slug', (req, res) => {
    const { slug } = req.params
    try {
      const listings = readPrints()
      const idx = listings.findIndex(l => l.slug === slug)
      if (idx === -1) return res.status(404).json({ error: 'Listing not found' })
      listings[idx] = Object.assign({}, listings[idx], req.body)
      writePrints(listings)
      res.json({ success: true })
    } catch (e) { res.status(500).json({ error: e.message }) }
  })

  // POST /api/prints/reorder — rewrite prints array order
  server.post('/api/prints/reorder', (req, res) => {
    const { order } = req.body
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Missing order array' })
    try {
      const listings = readPrints()
      const listingMap = {}
      listings.forEach(l => { listingMap[l.slug] = l })
      const reordered = order.filter(slug => listingMap[slug]).map(slug => listingMap[slug])
      // preserve any not in order array
      listings.forEach(l => { if (!order.includes(l.slug)) reordered.push(l) })
      writePrints(reordered)
      res.json({ success: true })
    } catch (e) { res.status(500).json({ error: e.message }) }
  })

  // DELETE /api/prints/:slug — remove listing
  server.delete('/api/prints/:slug', (req, res) => {
    const { slug } = req.params
    try {
      const listings = readPrints().filter(l => l.slug !== slug)
      writePrints(listings)
      res.json({ success: true })
    } catch (e) { res.status(500).json({ error: e.message }) }
  })

  // GET /api/image-dimensions?src=... — return pixel width/height of an image file
  server.get('/api/image-dimensions', (req, res) => {
    const src = req.query.src
    if (!src) return res.status(400).json({ error: 'Missing src' })
    const filePath = path.join(PROJECT_ROOT, 'public', src)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' })
    try {
      const buf = fs.readFileSync(filePath)
      // Parse dimensions from image header bytes (JPEG/PNG only, no deps needed)
      let w = null, h = null
      if (buf[0] === 0xFF && buf[1] === 0xD8) {
        // JPEG — scan for SOF marker
        let i = 2
        while (i < buf.length - 8) {
          if (buf[i] === 0xFF) {
            const marker = buf[i + 1]
            if (marker >= 0xC0 && marker <= 0xC3) {
              h = (buf[i + 5] << 8) | buf[i + 6]
              w = (buf[i + 7] << 8) | buf[i + 8]
              break
            }
            i += 2 + ((buf[i + 2] << 8) | buf[i + 3])
          } else { i++ }
        }
      } else if (buf[0] === 0x89 && buf[1] === 0x50) {
        // PNG
        w = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19]
        h = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23]
      }
      if (w && h) res.json({ width: w, height: h, ratio: (w / h).toFixed(4) })
      else res.status(422).json({ error: 'Could not read dimensions (unsupported format)' })
    } catch (e) { res.status(500).json({ error: e.message }) }
  })

  // GET /photo-image?src=/images/... — serve project images for Studio thumbnails
  server.get('/photo-image', (req, res) => {
    const src = req.query.src
    if (!src) return res.status(400).send('Missing src')
    const filePath = path.join(PROJECT_ROOT, 'public', src)
    if (!fs.existsSync(filePath)) return res.status(404).send('Not found')
    res.sendFile(filePath)
  })

  server.listen(PORT, () => console.log('[studio] server on ' + PORT))
}

// ── window ────────────────────────────────────────────────────────────────────

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 740,
    minWidth: 800,
    minHeight: 640,
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
