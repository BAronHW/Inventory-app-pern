import React from 'react';
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  return (
    <Link to={`/item/${item.id}`} className='item-card-link'>
      <div className='item-card'>
        <h2>{item.name}</h2>
        <p>Category: {item.category_id}</p>
        <p>Price: ${item.price}</p>
        <p>Stock: {item.stock}</p>
      </div>
    </Link>
  );
}

export default ItemCard;
