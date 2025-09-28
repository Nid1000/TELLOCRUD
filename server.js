// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares globales
app.use(cors());
app.use(express.json()); // reemplaza body-parser

// ✅ Servir archivos estáticos (HTML, CSS, JS) desde "public"
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Servir imágenes subidas desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Conexión a la base de datos (opcional probar aquí)
require('./db'); // importa db.js para probar conexión al iniciar

// ✅ Rutas
const authRoutes = require('./routes/auth');
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');

app.use('/auth', authRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);

// ✅ Raíz -> abrir index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Error handler básico
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
