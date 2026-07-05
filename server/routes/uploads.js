import express from 'express';

import { uploadImagesMiddleware } from '../middleware/upload.js';

const router = express.Router();

// Upload service images (multipart/form-data)
// - Field name: `images`
// - Accept multiple files: yes
// - Response: { urls: string[] }
router.post('/service-images', uploadImagesMiddleware.array('images', 6), async (req, res) => {
  // uploadImagesMiddleware stores files and exposes `req.files`
  const files = req.files || [];

  const urls = files
    .map((file) => {
      // file stored under /uploads; server/index.js will serve static content
      // Ensure we return a web-accessible URL.
      const cleaned = String(file.path).replaceAll('\\', '/');
      const idx = cleaned.indexOf('/uploads/');
      if (idx !== -1) {
        return `${req.protocol}://${req.get('host')}/uploads/${cleaned.split('/uploads/')[1]}`;
      }

      // fallback: best-effort
      return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    });

  res.json({ urls });
});

export default router;

