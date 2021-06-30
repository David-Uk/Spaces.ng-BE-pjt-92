const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database/pool");
const jwtTokens = require("../helpers/jwt-helpers");
/* const authenticateToken = require("../middleware/authorization"); */
const router = express.Router();

router.get("/users/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.status(200).json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users/createusers/", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashpassword = bcrypt.hashSync(password, 0);
    const newUser = await pool.query(
      "INSERT INTO users(username, password, email) VALUES($1, $2, $3)",
      [username, hashpassword, email]
    );
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/users/login/", async (req, res) => {
  try {
    const { password } = req.body;
    const users = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email=$2",
      [req.body.username, req.body.email]
    );
    const user = users.rows[0];
    if (user.length == 0)
      return res.status(401).json({ message: "Invalid username or email" });
    const validPassword = bcrypt.compare(password, user["password"]);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });
    const token = jwtTokens(user);
    res.json(token);
    /* if (user.rows === [])
      return res.status(401).json({ error: "Invalid username or email" });
    const validPassword = bcrypt.compare(password, user.rows.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });
    const token = jwtTokens(user.rows);
    res.json(token); */
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
