import React from 'react';
import Chatbot from './Chatbot';

export default function Aarogyam() {
  return (
    <section>
      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div className="small-muted">Aarogyam</div>
            <h2 style={{ margin:'6px 0 0 0' }}>AI Health Assistant</h2>
            <div className="small-muted" style={{ marginTop:8 }}>Ask your health-related queries, get summaries, and triage guidance powered by an LLM.</div>
          </div>
          <div>
            <div className="badge">Model: secure-proxy</div>
          </div>
        </div>

        <div style={{ marginTop:16 }}>
          <Chatbot />
        </div>
      </div>
    </section>
  );
}
