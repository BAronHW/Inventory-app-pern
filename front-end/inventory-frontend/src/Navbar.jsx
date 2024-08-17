import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className='navbar'>
      <Link to="/">
        <div>Home</div>
      </Link>
      <Link to="/categorylist">
        <div>Categories</div>
      </Link>
      <Link to="/newItem">
        <div>New Item</div>
      </Link>
      <Link to="/newCategory">
        <div>New Category</div>
      </Link>
    </div>
  );
}

export default Navbar;
