import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://chat-app-server-yl4m.onrender.com");

const ChatRoom = ({ username, handleLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userColors, setUserColors] = useState({});

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getUserColor = (user) => {
    if (!userColors[user]) {
      setUserColors((prevColors) => ({
        ...prevColors,
        [user]: getRandomColor(),
      }));
    }
    return userColors[user];
  };

  useEffect(() => {
    socket.on("chat-history", (data) => {
      setMessages(data);
      data.forEach((msg) => getUserColor(msg.username));
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
      getUserColor(message.username);
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
    };
  }, [userColors]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { username, text: newMessage };
      socket.emit("send-message", message);
      setNewMessage("");
    }
  };

  return (
    <div
      className="d-flex flex-column mt-3"
      style={{
        height: "100vh",
        width: "100vw",
        maxWidth: "100%",
      }}
    >
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">Chat Room</h5>
          <small>Logged in as: {username}</small>
        </div>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div
        className="card-body overflow-auto"
        style={{
          flexGrow: 1,
          backgroundColor: "#f8f9fa",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-3 ${
                msg.username === username
                  ? "align-self-end"
                  : "align-self-start"
              }`}
              style={{
                maxWidth: "70%",
                wordWrap: "break-word",
                backgroundColor:
                  msg.username === username
                    ? "#28a745"
                    : getUserColor(msg.username),
                color: msg.username === username ? "#fff" : "#000",
              }}
            >
              <strong>{msg.username}:</strong> {msg.text}
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No messages yet...</p>
        )}
      </div>
      <div className="card-footer d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          style={{ maxWidth: "calc(100% - 80px)" }}
        />
        <button className="btn btn-primary" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
