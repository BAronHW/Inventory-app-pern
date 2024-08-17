const express = require('express');
const router = express.Router();
const Category = require("../models/category");
const pool = require('../db/pool');

// list all the categories
router.get('/', async function(req, res, next) {
  try {
    const query = 'SELECT * FROM category;'
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// add a new category
router.post('/', async function(req, res, next) {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const query = 'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING *';
    const values = [name, description];
    
    const { rows } = await pool.query(query, values);
    const newCat = rows[0];

    res.status(201).json({ message: 'Category created successfully', category: newCat });
  } catch (error) {
    if (error.code === '23505') { // Unique violation error code in PostgreSQL
      return res.status(409).json({ message: 'Category already exists' });
    }
    next(error);
  }
});

module.exports = router;