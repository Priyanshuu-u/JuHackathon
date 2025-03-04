import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'; // Import the CSS file

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    } else {
      setUser(null); // In case there's no user data in localStorage
    }
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <ToastContainer /> {/* ToastContainer to render toasts */}

      <div className="content">
        <h2>Welcome, {user ? user.name : "Guest"}</h2>
        <p>Explore the amazing features of our platform.</p>
        <button className="explore-button">Explore Now</button>
      </div>
    </div>
  );
}

export default Home;
