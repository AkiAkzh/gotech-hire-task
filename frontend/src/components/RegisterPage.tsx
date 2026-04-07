import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ROUTES } from '../config';

interface Props {
  onRegister: (token: string, userId: number) => void;
}

export default function RegisterPage({ onRegister }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      onRegister(data.token, data.userId);
    } catch {
      setError('Network error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <h2>Register</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>
          Register
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p style={{ marginTop: '12px' }}>
        Already have an account? <Link to={ROUTES.login}>Login</Link>
      </p>
    </div>
  );
}