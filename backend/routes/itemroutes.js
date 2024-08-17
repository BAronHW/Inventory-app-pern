const express = require('express');
const router = express.Router();
const Item = require("../models/item");
const Category = require('../models/category');
const pool = require('../db/pool');


// Get all items
router.get('/', async function(req, res, next) {
  try {
    const items = await Item.find({}).populate('category', 'name');
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Get items by category
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

// Get all items
router.get('/', async function(req, res, next) {
  try {
    const query = `
      SELECT i.*, c.name AS category_name
      FROM items i
      LEFT JOIN category c ON i.category_id = c.id
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Create a new item
router.post('/', async function(req, res, next) {
  const { name, price, categoryName, description, stock } = req.body;
  if (!name || !price || !categoryName || !stock) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await pool.query('BEGIN');

    let categoryId;
    const categoryQuery = 'SELECT id FROM category WHERE name = $1';
    const categoryResult = await pool.query(categoryQuery, [categoryName]);

    if (categoryResult.rows.length === 0) {
      const insertCategoryQuery = 'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING id';
      const newCategory = await pool.query(insertCategoryQuery, [categoryName, '']);
      categoryId = newCategory.rows[0].id;
    } else {
      categoryId = categoryResult.rows[0].id;
    }

    const insertItemQuery = `
      INSERT INTO items (name, price, category_id, description, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const newItem = await pool.query(insertItemQuery, [name, price, categoryId, description, stock]);

    await pool.query('COMMIT');

    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Failed to add new item:', error);
    res.status(500).json({ error: 'Failed to add new item', details: error.message });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    const idToDelete = req.params.id;
    if (!idToDelete) {
      return res.status(400).json({ error: 'No ID provided' });
    }

    const query = 'DELETE FROM items WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [idToDelete]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log('Deleted item:', rows[0]);
    res.status(200).json({ message: 'Item deleted successfully', item: rows[0] });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

