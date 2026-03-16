import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, email }),
      });
      if (response.ok) {
        setMessage('Monitor added');
        setUrl('');
        setEmail('');
      } else {
        setMessage('Error adding monitor');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error adding monitor');
    }
  };

  return (
    <div className="App">
      <h1>PageWatch</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Monitor Page</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;