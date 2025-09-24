const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET lista (opcional ?categoria=ID)
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    let sql = `
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.categoria_id,
             c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
    const params = [];
    if (categoria) { sql += ' WHERE p.categoria_id = ?'; params.push(categoria); }
    sql += ' ORDER BY p.nombre ASC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.categoria_id, c.nombre AS categoria
       FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`, [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST (protegido)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombre, precio, categoriaId, categoria_id, descripcion = null } = req.body || {};
    const catId = categoriaId ?? categoria_id ?? null;
    if (!nombre || precio == null) return res.status(400).json({ error: 'nombre y precio requeridos' });

    const [r] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, catId]
    );
    res.json({ id: r.insertId, nombre, descripcion, precio, categoria_id: catId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT (protegido)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoriaId, categoria_id, descripcion = null } = req.body || {};
    const catId = categoriaId ?? categoria_id ?? null;

    await db.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria_id=? WHERE id=?',
      [nombre, descripcion, precio, catId, id]
    );
    res.json({ id, nombre, descripcion, precio, categoria_id: catId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE (protegido)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
