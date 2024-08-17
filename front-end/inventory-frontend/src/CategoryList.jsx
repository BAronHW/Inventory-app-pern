import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/categories')
      .then((res) => {
        setCategoryList(res.data);
        console.log(categoryList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="category-list">
      <h1 className="title">Categories</h1>
      {categoryList.length === 0 ? (
        <p className="no-categories">No categories found.</p>
      ) : (
        <div className="category-grid">
          {categoryList.map((category) => (
            <div key={category._id} className="category-card">
              <Link to={`/categories/${category._id}`}>
                <p>{category._id}</p>
              </Link>
              <p>{category.name}</p>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryList;
