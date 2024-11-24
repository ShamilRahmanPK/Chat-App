import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';

const App = () => {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        height: "100vh",
        backgroundColor: "#f0f8ff",
      }}
    >
      <div
        className="card mx-auto p-4 shadow-lg"
        style={{
          maxWidth: loggedIn ? "600px" : "400px",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0 0 20px rgba(0, 123, 255, 0.5)",
        }}
      >
        {!loggedIn ? (
          <>
            <h2 className="mb-3">Welcome to Car ChatApp</h2>
            <p className="text-muted mb-4">
              Join the global conversation about cars! Ask questions, share
              knowledge, and solve car doubts.
            </p>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button className="btn btn-primary w-100" onClick={handleLogin}>
              Join Global Car Chat
            </button>
          </>
        ) : (
          <ChatRoom username={username} handleLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

export default App;
