const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/pokemon — todos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pokemon ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pokemon/nombre/:nombre — buscar por nombre
router.get("/nombre/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const result = await pool.query(
      "SELECT * FROM pokemon WHERE nombre ILIKE $1",
      [nombre],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pokémon no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pokemon/:id — buscar por id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM pokemon WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pokémon no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
