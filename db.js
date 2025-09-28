// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Conexión a PostgreSQL usando la URL de Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render necesita SSL
});

// Probar la conexión
pool.connect()
  .then(client => {
    console.log('✅ Conectado a PostgreSQL');
    client.release();
  })
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

module.exports = pool;

