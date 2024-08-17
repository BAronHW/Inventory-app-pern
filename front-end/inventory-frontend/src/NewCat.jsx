import React, { useState } from 'react';
import axios from 'axios';

function NewCat() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/categories', { name, description });
      setSuccess('Category created successfully!');
      setName('');
      setDescription('');
    } catch (err) {
      setError('Failed to create category. Please try again.');
      console.error('Error creating category:', err);
    }
  };

  return (
    <div className="new-cat">
      <h2 className="title">Create New Category</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
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
        <button type="submit" className="button">
          Create Category
        </button>
      </form>
    </div>
  );
}

export default NewCat;
