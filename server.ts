import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  INITIAL_ARTWORKS,
  INITIAL_ARTIST_PROFILE,
  INITIAL_ORDERS,
  INITIAL_INQUIRIES,
  INITIAL_TESTIMONIALS,
} from './src/data/initialArtworks.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support JSON payloads up to 30mb (for custom artwork image uploads)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Database storage directory & file
const dataDir = path.resolve(__dirname, 'data');
const dbFile = path.resolve(dataDir, 'database.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface DatabaseState {
  artworks: any[];
  orders: any[];
  inquiries: any[];
  testimonials: any[];
  artistProfile: any;
  lastUpdated: number;
}

function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(dbFile)) {
      const content = fs.readFileSync(dbFile, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        artworks: parsed.artworks || INITIAL_ARTWORKS,
        orders: parsed.orders || INITIAL_ORDERS,
        inquiries: parsed.inquiries || INITIAL_INQUIRIES,
        testimonials: parsed.testimonials || INITIAL_TESTIMONIALS,
        artistProfile: parsed.artistProfile || INITIAL_ARTIST_PROFILE,
        lastUpdated: parsed.lastUpdated || Date.now(),
      };
    }
  } catch (err) {
    console.error('Error reading database file, using defaults:', err);
  }

  const initialData: DatabaseState = {
    artworks: INITIAL_ARTWORKS,
    orders: INITIAL_ORDERS,
    inquiries: INITIAL_INQUIRIES,
    testimonials: INITIAL_TESTIMONIALS,
    artistProfile: INITIAL_ARTIST_PROFILE,
    lastUpdated: Date.now(),
  };
  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(data: DatabaseState) {
  try {
    data.lastUpdated = Date.now();
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

let db = loadDatabase();

// Server-Sent Events (SSE) active subscriber pool
const sseClients = new Set<express.Response>();

function broadcast(eventType: string, payload: any) {
  const dataString = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(dataString);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Heartbeat ping to keep SSE connections alive across proxy/mobile networks
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(':ping\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 20000);

// =================== API ENDPOINTS ===================

// Real-time SSE stream for instant updates on mobile phones and open browsers
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', lastUpdated: db.lastUpdated })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Lightweight version check for polling fallback
app.get('/api/version', (_req, res) => {
  res.json({
    lastUpdated: db.lastUpdated,
    artworksCount: db.artworks.length,
    ordersCount: db.orders.length,
    testimonialsCount: db.testimonials.length,
  });
});

// Full state sync
app.get('/api/data', (_req, res) => {
  res.json({
    artworks: db.artworks,
    orders: db.orders,
    inquiries: db.inquiries,
    testimonials: db.testimonials,
    artistProfile: db.artistProfile,
    lastUpdated: db.lastUpdated,
  });
});

// Artwork CRUD
app.post('/api/artworks', (req, res) => {
  try {
    const artworkData = req.body;
    const id = artworkData.id || 'art-' + Date.now();
    const createdAt = artworkData.createdAt || new Date().toISOString().split('T')[0];
    const newArtwork = {
      ...artworkData,
      id,
      createdAt,
    };

    // Prepend new artwork to catalog
    db.artworks.unshift(newArtwork);
    saveDatabase(db);

    // Broadcast instant real-time event to all connected devices & installed PWAs
    broadcast('ARTWORK_ADDED', {
      artwork: newArtwork,
      message: `Nouvelle œuvre : "${newArtwork.title}" ajoutée par BANORA !`,
      lastUpdated: db.lastUpdated,
    });

    res.status(201).json(newArtwork);
  } catch (error) {
    console.error('Error adding artwork:', error);
    res.status(500).json({ error: 'Failed to add artwork' });
  }
});

app.put('/api/artworks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let updatedArtwork: any = null;

    db.artworks = db.artworks.map((art) => {
      if (art.id === id) {
        updatedArtwork = { ...art, ...updates };
        return updatedArtwork;
      }
      return art;
    });

    saveDatabase(db);

    if (updatedArtwork) {
      broadcast('ARTWORK_UPDATED', {
        artwork: updatedArtwork,
        lastUpdated: db.lastUpdated,
      });
      res.json(updatedArtwork);
    } else {
      res.status(404).json({ error: 'Artwork not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update artwork' });
  }
});

app.delete('/api/artworks/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.artworks = db.artworks.filter((art) => art.id !== id);
    saveDatabase(db);

    broadcast('ARTWORK_DELETED', {
      id,
      lastUpdated: db.lastUpdated,
    });

    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

// Galleries / Collections Management
app.delete('/api/galleries/:name', (req, res) => {
  try {
    const galleryName = decodeURIComponent(req.params.name);
    const { reassignTo, deleteArtworks } = req.body || {};

    if (deleteArtworks) {
      db.artworks = db.artworks.filter((art) => art.category !== galleryName);
    } else {
      const target = reassignTo || 'Série Sahel';
      db.artworks = db.artworks.map((art) =>
        art.category === galleryName ? { ...art, category: target } : art
      );
    }

    saveDatabase(db);
    broadcast('GALLERY_DELETED', {
      galleryName,
      reassignTo,
      deleteArtworks,
      artworks: db.artworks,
      lastUpdated: db.lastUpdated,
    });

    res.json({ success: true, galleryName });
  } catch (error) {
    console.error('Failed to delete gallery:', error);
    res.status(500).json({ error: 'Failed to delete gallery' });
  }
});

app.put('/api/galleries/:name', (req, res) => {
  try {
    const oldName = decodeURIComponent(req.params.name);
    const { newName } = req.body || {};

    if (!newName) {
      return res.status(400).json({ error: 'newName is required' });
    }

    db.artworks = db.artworks.map((art) =>
      art.category === oldName ? { ...art, category: newName } : art
    );

    saveDatabase(db);
    broadcast('GALLERY_RENAMED', {
      oldName,
      newName,
      artworks: db.artworks,
      lastUpdated: db.lastUpdated,
    });

    res.json({ success: true, oldName, newName });
  } catch (error) {
    console.error('Failed to rename gallery:', error);
    res.status(500).json({ error: 'Failed to rename gallery' });
  }
});

// Orders
app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    const count = db.orders.length + 90;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = orderData.orderNumber || `CMD-2026-${count}-${randomSuffix}`;
    const date = orderData.date || new Date().toISOString().split('T')[0];

    const newOrder = {
      ...orderData,
      id: orderData.id || 'ord-' + Date.now(),
      orderNumber,
      date,
    };

    db.orders.unshift(newOrder);

    // Automatically reserve purchased artworks
    if (newOrder.items && Array.isArray(newOrder.items)) {
      newOrder.items.forEach((item: any) => {
        db.artworks = db.artworks.map((art) =>
          art.id === item.artworkId ? { ...art, status: 'reserve' } : art
        );
      });
    }

    saveDatabase(db);

    broadcast('ORDER_CREATED', {
      order: newOrder,
      lastUpdated: db.lastUpdated,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updatedOrder: any = null;
    db.orders = db.orders.map((o) => {
      if (o.id === id) {
        updatedOrder = { ...o, status };
        return updatedOrder;
      }
      return o;
    });

    saveDatabase(db);

    if (updatedOrder) {
      broadcast('ORDER_UPDATED', {
        order: updatedOrder,
        lastUpdated: db.lastUpdated,
      });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Inquiries
app.post('/api/inquiries', (req, res) => {
  try {
    const inqData = req.body;
    const newInquiry = {
      ...inqData,
      id: 'inq-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'nouveau',
    };

    db.inquiries.unshift(newInquiry);
    saveDatabase(db);

    broadcast('INQUIRY_CREATED', {
      inquiry: newInquiry,
      lastUpdated: db.lastUpdated,
    });

    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

app.put('/api/inquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated: any = null;
    db.inquiries = db.inquiries.map((inq) => {
      if (inq.id === id) {
        updated = { ...inq, status };
        return updated;
      }
      return inq;
    });

    saveDatabase(db);

    if (updated) {
      broadcast('INQUIRY_UPDATED', {
        inquiry: updated,
        lastUpdated: db.lastUpdated,
      });
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// Testimonials
app.post('/api/testimonials', (req, res) => {
  try {
    const tData = req.body;
    const newT = {
      ...tData,
      id: 'test-' + Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    };

    db.testimonials.unshift(newT);
    saveDatabase(db);

    broadcast('TESTIMONIAL_ADDED', {
      testimonial: newT,
      lastUpdated: db.lastUpdated,
    });

    res.status(201).json(newT);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add testimonial' });
  }
});

app.delete('/api/testimonials/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
    saveDatabase(db);

    broadcast('TESTIMONIAL_DELETED', {
      id,
      lastUpdated: db.lastUpdated,
    });

    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// Profile
app.put('/api/profile', (req, res) => {
  try {
    db.artistProfile = req.body;
    saveDatabase(db);

    broadcast('PROFILE_UPDATED', {
      artistProfile: db.artistProfile,
      lastUpdated: db.lastUpdated,
    });

    res.json(db.artistProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Reset
app.post('/api/reset', (_req, res) => {
  db = {
    artworks: INITIAL_ARTWORKS,
    orders: INITIAL_ORDERS,
    inquiries: INITIAL_INQUIRIES,
    testimonials: INITIAL_TESTIMONIALS,
    artistProfile: INITIAL_ARTIST_PROFILE,
    lastUpdated: Date.now(),
  };
  saveDatabase(db);

  broadcast('DATABASE_RESET', {
    lastUpdated: db.lastUpdated,
  });

  res.json({ success: true, data: db });
});

// Secure Admin Authentication Endpoint
app.post('/api/admin/login', (req, res) => {
  try {
    const { passcode } = req.body || {};
    const expectedPassword = process.env.ADMIN_PASSWORD || 'KSNcd64g&&';

    if (!passcode || typeof passcode !== 'string') {
      return res.status(400).json({ success: false, error: 'Passcode required' });
    }

    const inputBuffer = Buffer.from(passcode);
    const expectedBuffer = Buffer.from(expectedPassword);

    let isValid = false;
    if (inputBuffer.length === expectedBuffer.length) {
      try {
        isValid = crypto.timingSafeEqual(inputBuffer, expectedBuffer);
      } catch {
        isValid = false;
      }
    }

    if (isValid) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Authentication error' });
  }
});

// =================== VITE MIDDLEWARE / STATIC FILES ===================

async function startServer() {
  if (!isProduction) {
    // In dev: mount Vite dev server as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Galerie BANORA running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
