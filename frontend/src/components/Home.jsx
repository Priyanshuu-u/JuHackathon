import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

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
    <div>
      <Navbar />
      <ToastContainer /> {/* ToastContainer to render toasts */}

      <div className="content">
        <h2>Welcome, {user ? user.name : "Guest"}</h2>
        {/* The rest of your homepage content */}
      </div>
    </div>
  );
}

export default Home;
