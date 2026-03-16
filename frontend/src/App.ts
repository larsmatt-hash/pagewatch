/// <reference types="vite/client" />
import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/monitor`, {
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

  return React.createElement(
    'div',
    { className: 'App' },
    React.createElement('h1', null, 'PageWatch'),
    React.createElement(
      'form',
      { onSubmit: handleSubmit },
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'url' }, 'Website URL'),
        React.createElement('input', {
          type: 'url',
          id: 'url',
          value: url,
          onChange: (e) => setUrl((e.target as HTMLInputElement).value),
          required: true,
        }),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'email' }, 'Email'),
        React.createElement('input', {
          type: 'email',
          id: 'email',
          value: email,
          onChange: (e) => setEmail((e.target as HTMLInputElement).value),
          required: true,
        }),
      ),
      React.createElement('button', { type: 'submit' }, 'Monitor Page'),
    ),
    message && React.createElement('p', null, message),
  );
}
