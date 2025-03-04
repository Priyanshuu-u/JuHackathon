import React, { useState } from 'react';

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    const response = await fetch('https://api.infermedica.com/v3/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Id': 'your-app-id', // Replace with your Infermedica App ID
        'App-Key': 'your-app-key' // Replace with your Infermedica App Key
      },
      body: JSON.stringify({ text: input })
    });

    const data = await response.json();
    const aiMessage = { sender: 'ai', text: data.text };

    setMessages([...messages, userMessage, aiMessage]);
    setInput('');
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your medical question..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default AIChat;
