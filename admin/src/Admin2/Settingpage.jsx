import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  });

  // Fetch admin profile on load
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get(
          "https://resource-allocator-backendservice.onrender.com/api/admin/profile",
          { headers: getAuthHeaders() }
        );
        setAdminData({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("Failed to fetch admin data ❌", err);
        setMessage({ type: "error", text: "Failed to load admin data." });
      }
    };
    fetchAdminData();
  }, []);

  // Update profile info (name, email)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!adminData.name || !adminData.email) {
      setMessage({ type: "error", text: "Name and email are required." });
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        "https://resource-allocator-backendservice.onrender.com/api/admin/profile",
        { name: adminData.name, email: adminData.email },
        { headers: getAuthHeaders() }
      );
      setMessage({ type: "success", text: "Profile updated successfully ✅" });
    } catch (err) {
      console.error("Failed to update profile ❌", err);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!passwords.oldPassword || !passwords.newPassword) {
      setMessage({ type: "error", text: "Both password fields are required." });
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        "https://resource-allocator-backendservice.onrender.com/api/admin/password",
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: getAuthHeaders() }
      );
      setMessage({ type: "success", text: "Password changed successfully ✅" });
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Failed to change password ❌", err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const containerStyle = { padding: "30px 40px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f3f6f9", minHeight: "100vh" };
  const headerStyle = { fontSize: "28px", fontWeight: "700", marginBottom: "20px", color: "#1d4ed8" };
  const formStyle = { marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" };
  const inputStyle = { width: "100%", padding: "12px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px" };
  const buttonStyle = { padding: "10px 16px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
  const messageStyle = (type) => ({ color: type === "error" ? "#ef4444" : "#16a34a", fontWeight: "600", marginBottom: "15px" });

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Admin Settings</h1>

      {message.text && <p style={messageStyle(message.type)}>{message.text}</p>}

      {/* Profile Update Form */}
      <form style={formStyle} onSubmit={handleProfileUpdate}>
        <input
          type="text"
          placeholder="Name"
          value={adminData.name}
          onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={adminData.email}
          onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Change Password Form */}
      <form style={formStyle} onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
