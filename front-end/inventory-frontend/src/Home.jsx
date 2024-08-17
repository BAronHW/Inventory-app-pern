import React from 'react';

function Home({ items }) {
  return (
    <div className='item-grid'>
      {items.map((item, index) => (
        <div key={index} className='item-card'>
          <h1>{item.id}</h1>
          <p>{item.name}</p>
          <p>{item.description}</p>
          <p>{item.price}</p>
          <p>{item.stock}</p>
          <p>{item.category_id}</p>
          <p>{item.created_at}</p>
          <p>{item.updated_at}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
