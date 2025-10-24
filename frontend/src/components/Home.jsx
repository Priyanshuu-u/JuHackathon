import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';
import '../App.css';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
  }, []);

  const surgicalChecklists = [
    { title: 'Pre-Surgery Checklist', description: 'Ensure all pre-surgery steps are completed.' },
    { title: 'Intraoperative Checklist', description: 'Monitor patient during surgery.' },
    { title: 'Post-Surgery Checklist', description: 'Post-surgery care and monitoring.' },
  ];

  return (
    <>
      <Navbar />
      <div className="home-container">
        <ToastContainer />
        <div className="content app-container">
          <div className="left">
            <div className="card">
              <div className="kicker">Welcome</div>
              <h2 style={{ marginTop: 6 }}>Hello, {user ? user.name : "Guest"}</h2>
              <p style={{ marginTop: 8, color: 'var(--muted)' }}>Your role: {user ? user.role : "N/A"}</p>
            </div>

            <div className="card">
              <div className="kicker">Checklists</div>
              <div className="grid-cards">
                {surgicalChecklists.map((checklist, index) => (
                  <div key={index} className="card-modern card" style={{ padding: 12 }}>
                    <h3>{checklist.title}</h3>
                    <p>{checklist.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="right">
            <div className="quick-card">
              <div className="kicker">Quick Actions</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <a href="/aarogyam" className="btn-primary" style={{ textDecoration: 'none' }}>Ask Assistant</a>
                <a href="/new-checklist" className="btn-ghost" style={{ textDecoration: 'none' }}>New Checklist</a>
              </div>

              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: 0 }}>Resources</h4>
                <p style={{ color: 'var(--muted)', marginTop: 6 }}>Guides, protocols, and local contacts to help implement checklists.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default Home;
