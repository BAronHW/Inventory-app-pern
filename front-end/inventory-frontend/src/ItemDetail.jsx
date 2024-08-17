import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [formon, setformon] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/items/category/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the item:', error);
        setError('Error fetching item data');
      });
  }, [id]);

  if (error) {
    return <div className='error-screen'>{error}</div>;
  }

  if (!item) {
    return <div className='loading-screen'>Loading...</div>;
  }

  const handleClick = () =>{
    try{
      axios.delete(`http://localhost:3000/items/${id}`);
      navigate('/')
    }catch(error){
      console.log(error);
    }
  }

  const handleform = () =>{
    setformon(!formon);
    console.log(formon);
  }



  return (
    <div className='item-detail'>
      <Link to="/" className='back-link'>← Back to All Items</Link>
      <div className='item-detail-card'>
        <div className='item-detail-content'>
          <h1>Item: {item.name}</h1>
          <p>ID: {item._id}</p>
          <p>Category: {item.categoryName}</p>
          <p>Price: ${item.price.toFixed(2)}</p>
          <p>Description: {item.description}</p>
          <p>Stock: {item.stock}</p>
          <button className='delete-button' onClick={handleClick}>Delete Me</button>
          <button className='modify-button' onClick={handleform}>Modify Me</button>
          {formon ? <div>form is on</div> : ""}
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
