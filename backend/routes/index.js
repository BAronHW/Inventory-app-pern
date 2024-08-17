const express = require('express');
const router = express.Router();
const Item = require("../models/item");
const pool = require('../db/pool');

router.get('/', async function(req, res, next) {
  try {
    const query = 'SELECT * FROM items;'
    const { rows } = await pool.query(query);
    console.log(rows);
    res.json(rows)
  } catch (error) {
    next(error);
  }
});

router.get('/category/:categoryId', async function(req, res, next) {
  try {
    const query = `
      SELECT i.*, c.name AS category_name
      FROM items i
      JOIN category c ON i.category_id = c.id
      WHERE i.category_id = $1
    `;
    const values = [req.params.categoryId];
    
    const result = await pool.query(query, values);
    const items = result.rows;
    
    res.json(items);
  } catch (error) {
    next(error);
  }
});

module.exports = router;