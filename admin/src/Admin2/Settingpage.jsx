import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  // Fetch admin profile on load
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setAdminData({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("Failed to fetch admin data ❌");
      }
    };
    fetchAdminData();
  }, []);

  // Update profile info (name, email)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/admin/profile",
        { name: adminData.name, email: adminData.email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
    } catch (err) {
      console.error("Failed to update profile ❌");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.oldPassword || !passwords.newPassword) return;

    try {
      await axios.put(
        "http://localhost:5000/api/admin/password",
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Failed to change password ❌");
    }
  };

  // Inline styles
  const containerStyle = { padding: "30px 40px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f3f6f9", minHeight: "100vh" };
  const headerStyle = { fontSize: "28px", fontWeight: "700", marginBottom: "20px", color: "#1d4ed8" };
  const formStyle = { marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" };
  const inputStyle = { width: "100%", padding: "12px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px" };
  const buttonStyle = { padding: "10px 16px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Admin Settings</h1>

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
        <button type="submit" style={buttonStyle}>Update Profile</button>
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
        <button type="submit" style={buttonStyle}>Change Password</button>
      </form>
    </div>
  );
};

export default Settings;
