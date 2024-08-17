import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/signup', { username, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Sign Up</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input"
        />
        <button type="submit" className="button">Sign Up</button>
      </form>
      {message && (
        <p className={`message ${message.includes('failed') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Signup;