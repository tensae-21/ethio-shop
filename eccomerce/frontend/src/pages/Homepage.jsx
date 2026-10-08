// src/pages/Homepage.jsx
import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/common/Hero';

const Homepage = () => {
  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Homepage;