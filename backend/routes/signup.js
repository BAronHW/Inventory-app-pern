const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/' , async function(){
    const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username';
    const { rows } = await pool.query(query, [username, hashedPassword]);
    res.status(201).json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});