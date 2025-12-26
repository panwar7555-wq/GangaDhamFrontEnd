import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function AddUserPage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newUser, setNewUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const bodyData = phoneNumber
        ? { name, phoneNumber }
        : { name }; // ✅ send only name if phone is empty

      const res = await fetch("https://gangadhambackend-1.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setNewUser(data); // success
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server not reachable");
    }
  };

  // ✅ Success screen
  if (newUser) {
    return (
      <div className="message-box success">
        <h2>User Created Successfully!</h2>
        <p><strong>Name:</strong> {newUser.name}</p>
        <p><strong>Phone:</strong> {newUser.phoneNumber || "Not provided"}</p>
        <p><strong>Balance:</strong> {newUser.balance}</p>
        <button onClick={() => navigate("/")}>Okay</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label><br />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>

      {/* ✅ Error message */}
      {error && (
        <div className="message-box error">
          {error}
        </div>
      )}
    </div>
  );
}

export default AddUserPage;
