require("dotenv").config();
const { Pool } = require("pg");

console.log("DATABASE_URL:", process.env.DATABASE_URL); // línea de debug temporal

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err.message);
  } else {
    console.log("Conectado a PostgreSQL correctamente");
  }
});

module.exports = pool;
