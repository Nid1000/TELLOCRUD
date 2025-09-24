const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// públicas
router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT id, url, producto_id AS productoId FROM imagenes_productos');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:producto_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, url, producto_id AS productoId FROM imagenes_productos WHERE producto_id=?',
      [req.params.producto_id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// protegidas
router.post('/', verifyToken, upload.single('imagen'), async (req, res) => {
  try {
    const { productoId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Falta imagen' });
    const url = `/uploads/${req.file.filename}`;
    const [r] = await db.query('INSERT INTO imagenes_productos (url, producto_id) VALUES (?, ?)', [url, productoId]);
    res.json({ id: r.insertId, url, productoId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM imagenes_productos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Imagen eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
