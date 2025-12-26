import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../App.css";

function EditUserPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Pre-fill form with selected user data
  const selectedUser = location.state?.user;

  const [formData, setFormData] = useState({
    name: selectedUser?.name || "",
    phoneNumber: selectedUser?.phoneNumber || "" // ✅ optional
  });

  const [message, setMessage] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const bodyData = {
      name: formData.name,
      phoneNumber: formData.phoneNumber || "" // ✅ always send, empty string if blank
    };

    const res = await fetch(`https://gangadhambackend-1.onrender.com/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: "User updated successfully!" });
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage({ type: "error", text: data.error || "Failed to update user" });
    }
  } catch (err) {
    console.error("Update error:", err);
    setMessage({ type: "error", text: "Server not reachable" });
  }
};

  return (
    <div className="form-container">
      <h2>Edit User</h2>
      {message && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label><br />
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="Optional"
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditUserPage;
