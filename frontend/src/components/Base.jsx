import React from 'react';
import "../App.css";
import { Link } from "react-router-dom";
import Logo from "../assets/Mednova.png";

function Base() {
  return (
    <div className="app-container" style={{ paddingTop: 36 }}>
      <div className="card-modern hero">
        <div className="hero-left">
          <div style={{ marginBottom: 12 }} className="kicker">WHO Surgical Safety Checklist</div>
          <h1 style={{ margin: 0, fontSize: 28, marginBottom: 12, color: 'var(--primary-600)' }}>
            Safer surgery. Better outcomes.
          </h1>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            MedNova helps health teams follow best practices, coordinate care, and reduce complications.
            Use the checklists, triage assistant and quick guides to improve patient safety.
          </p>

          <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
            <Link to="/aarogyam"><button className="btn-primary">Open Aarogyam Assistant</button></Link>
            <Link to="/new-checklist"><button className="btn-ghost">Create Checklist</button></Link>
          </div>
        </div>

        <div className="hero-right">
          <div style={{ width: '100%', maxWidth: 520 }}>
            <img
              src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/597aa93b-5c5c-412f-b38f-45a19338b780/97c5747d-76ec-433f-8fd8-afab38ba54b0.png"
              alt="WHO Checklist"
              style={{ width: '100%', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Base;
