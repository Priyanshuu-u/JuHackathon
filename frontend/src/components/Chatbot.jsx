import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Chatbot(){
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am Aarogyam Assistant. Ask me about symptoms, triage steps, or wellness tips.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();

  useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }, [messages]);

  async function sendMessage(e){
    e && e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      // Use the absolute backend URL (or replace with a client env var)
      const BACKEND = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://ju-backend.onrender.com';
      const res = await axios.post(`${BACKEND}/api/chat`, { message: text });
      const reply = res.data?.reply || 'Sorry, something went wrong.';
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error connecting to AI service.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-panel card">
      <div ref={boxRef} className="chat-messages" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'bot'}`}>{m.text}</div>
        ))}
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input placeholder="Ask Aarogyam..." value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit" className="btn" disabled={loading}>{loading ? '...' : 'Send'}</button>
      </form>
    </div>
  );
}
