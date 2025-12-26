import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null); // success/error messages
  const [confirmBox, setConfirmBox] = useState(null); // confirmation popup
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://gangadhambackend-1.onrender.com/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`https://gangadhambackend-1.onrender.com/users/${userId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "User and transactions deleted successfully!" });
        setUsers(users.filter(u => u._id !== userId));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete user" });
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage({ type: "error", text: "Server not reachable" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // ✅ Safe filtering: check fields exist before calling .includes()
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const nameMatch = user.name && user.name.toLowerCase().includes(term);
    const phoneMatch = user.phoneNumber && user.phoneNumber.includes(searchTerm);
    return nameMatch || phoneMatch;
  });

  return (
    <div>
      <div className="custom-top-bar">
        {/* Left: Logo */}
        <div className="top-left">
          <img src="/Copilot_20251226_121445.png" alt="Logo" className="logo-img" />
        </div>

        {/* Center: Title */}
        <div className="top-center">
          <h2 className="page-title">M/s Ganga Dham Filling Station</h2>
        </div>

        {/* Right: Phone numbers */}
        <div className="top-right">
          <p></p>
          <p></p>
        </div>
      </div>
      {/* Top bar with Add button */}
      <div className="top-bar">
        <button onClick={() => navigate("/add")}>Add User</button>
      </div>

      {/* Search bar */}
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {/* ✅ Message box for success/error */}
      {message && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* ✅ Confirmation popup */}
      {confirmBox && (
        <div className="message-box warning">
          <p>Do you want to delete <strong>{confirmBox.name}</strong>?</p>
          <button
            onClick={() => {
              handleDelete(confirmBox.id);
              setConfirmBox(null);
            }}
          >
            Confirm
          </button>
          <button onClick={() => setConfirmBox(null)}>Cancel</button>
        </div>
      )}

      {/* Cards layout */}
      <div className="cards-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`user-card ${user.balance <= 0 ? "negative" : "positive"}`}
              onClick={() => navigate(`/transactions/${user._id}`)}
            >
              <h3>{user.name}</h3>
              {/* ✅ Only show phone if present */}
              {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
              <p><strong>Balance:</strong> {user.balance}</p>
              <div className="card-buttons">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${user._id}`, { state: { user } });
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmBox({ id: user._id, name: user.name });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
