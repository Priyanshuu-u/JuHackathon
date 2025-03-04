import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import { ToastContainer } from 'react-toastify';
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

  const surgicalChecklists = [
    { title: 'Pre-Surgery Checklist', description: 'Ensure all pre-surgery steps are completed.' },
    { title: 'Intraoperative Checklist', description: 'Monitor patient during surgery.' },
    { title: 'Post-Surgery Checklist', description: 'Post-surgery care and monitoring.' },
  ];

  return (
    <div className="home-container">
      <Navbar />
      <ToastContainer /> {/* ToastContainer to render toasts */}

      <div className="content">
        <h2>Welcome, {user ? user.name : "Guest"}</h2>
        <p>Your role: {user ? user.role : "N/A"}</p>

        <div className="card-container">
          {surgicalChecklists.map((checklist, index) => (
            <div key={index} className="card">
              <h3>{checklist.title}</h3>
              <p>{checklist.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
