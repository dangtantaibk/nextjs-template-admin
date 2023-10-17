'use client'
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function Home() {
    const [message, setMessage] = useState('');
    const [inputMessage, setInputMessage] = useState('');
  
    useEffect(() => {
      const socket = io('http://34.87.135.19:8765'); 
  
      socket.on('chat message', (data) => {
        setMessage(data);
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);
  
    const sendMessage = () => {
      const socket = io('http://34.87.135.19:8765'); 
      socket.emit('chat message', inputMessage);
      setInputMessage('');
    };
  
    return (
      <div>
        <h1>Socket.io Chat with Next.js</h1>
        <p>Message from server: {message}</p>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    );
  }