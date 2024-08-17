import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import NewItem from './NewItem';
import Navbar from './Navbar';
import ItemList from './ItemList';
import ItemDetail from './ItemDetail';
import CategoryList from './CategoryList';
import CategoryCard from './CategoryCard';
import NewCat from './NewCat';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' or 'signup'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    axios.get('http://localhost:3000/api/user', { withCredentials: true })
      .then(response => setUser(response.data.user))
      .catch(error => console.error('Error fetching user', error));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/api/logout', { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate('/');
  };

  return (
    <div>
      {user ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <div className='app'>
            <Navbar />
            <Routes>
              <Route path="/" element={<ItemList />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path='/categorylist' element={<CategoryList />} />
              <Route path='/categories/:id' element={<CategoryCard />}/>
              <Route path='/newitem' element={<NewItem />} />
              <Route path='/newCategory' element={<NewCat />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <h1>Please login or sign up</h1>
          {view === 'login' ? (
            <>
              <Login onLogin={handleLogin} />
              <p>Don't have an account? <button onClick={() => setView('signup')}>Sign Up</button></p>
            </>
          ) : (
            <>
              <Signup />
              <p>Already have an account? <button onClick={() => setView('login')}>Login</button></p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;