import React from 'react';
import '../App.css';
import { Link } from "react-router-dom";
import Logo from "../assets/Mednova.png";

function Navbar() {
  return (
    <header className="app-navbar app-container">
      <div className="app-logo">
        <img src={Logo} alt="MedNova" />
        <div>
          <div className="app-brand">MedNova</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Care • Triage • Assist</div>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
        <Link to="/medi-mitra" className="btn-ghost">Medi-Mitra</Link>
        <Link to="/aarogyam" className="btn-ghost">Aarogyam</Link>
        <Link to="/about" className="btn-ghost">About</Link>
      </nav>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link to="/new-checklist" className="btn-primary">New Checklist</Link>
      </div>
    </header>
  );
}

export default Navbar;
