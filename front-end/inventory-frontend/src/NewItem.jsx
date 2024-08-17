import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/categories/')
      .then(response => setCategories(response.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !price || !stock || !categoryId) {
      setError('All fields are required');
      return;
    }

    try {
      const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId));
      if (!selectedCategory) {
        setError('Invalid category selected');
        return;
      }

      const response = await axios.post('http://localhost:3000/items', {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryName: selectedCategory.name
      });

      setSuccess('Item created successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategoryId('');
    } catch (err) {
      setError('Failed to create item. Please try again.');
      console.error('Error creating item:', err);
    }
  };

  return (
    <div className="new-item">
      <h2 className="title">Create New Item</h2>
      {error && <p className="message error">{error}</p>}
      {success && <p className="message success">{success}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea"
            rows="3"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="input"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="select"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="button">
          Create Item
        </button>
      </form>
    </div>
  );
}

export default NewItem;
