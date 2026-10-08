import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear browser persistent storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear React user state
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="container p-5">
      <div className="card p-4 shadow-sm">
        <h2>Dashboard</h2>
        <p className="lead">Logged in as: <strong>{user?.email}</strong></p>
        <button className="btn btn-danger w-auto" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}