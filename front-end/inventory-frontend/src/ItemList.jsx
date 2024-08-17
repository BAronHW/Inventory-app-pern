import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

function ItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/')
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        console.error('There was an error making the request:', error);
        setError('Error fetching data');
      });
  }, []);

  if (error) {
    return <div className='error-screen'>{error}</div>;
  }

  return (
    <div className='item-list'>
      <h1 className='title'>Item Inventory</h1>
      <div className='item-grid'>
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ItemList;
