const pool = require("../config/db");

exports.searchEmployees = async (req, res) => {
  const { query } = req.query; // O termo de busca
  try {
    const result = await pool.query(
      `SELECT id, name, photo_path FROM employees WHERE name ILIKE $1`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar funcionários.", error });
  }
};
