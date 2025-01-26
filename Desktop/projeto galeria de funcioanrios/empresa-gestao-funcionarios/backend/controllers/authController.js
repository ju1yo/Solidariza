const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userQuery.rows.length === 0) return res.status(401).json({ message: "Usuário não encontrado." });

    const user = userQuery.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Senha inválida." });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login.", error });
  }
};
