import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  });

  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Authentication failed. Please log in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const cacheBuster = `?t=${new Date().getTime()}`;
      const res = await axios.get(
        `https://resource-allocator-backendservice.onrender.com/api/admin/users${cacheBuster}`,
        { headers: getAuthHeaders() }
      );

      if (!res.data || !Array.isArray(res.data.users)) {
        setError("Server returned invalid data format.");
        setUsers([]);
        return;
      }

      setUsers(res.data.users);
      setError("");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : "Failed to load user data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch + auto-refresh every 30 seconds
  useEffect(() => {
    fetchUsers(); // initial load

    const intervalId = setInterval(fetchUsers, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Session token is missing.");
      return;
    }

    try {
      await axios.delete(
        `https://resource-allocator-backendservice.onrender.com/api/admin/users/${id}`,
        { headers: getAuthHeaders() }
      );
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user ❌");
    }
  };

  if (isLoading) return <div style={{ textAlign: "center", padding: "50px", color: "#1d4ed8" }}>Loading registered users...</div>;

  return (
    <div style={{ padding: "30px 40px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f3f6f9", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px", color: "#1d4ed8" }}>
        Registered Website Users ({users.length})
      </h1>

      {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px", fontWeight: "600" }}>{error}</p>}

      <div style={{ overflowX: "auto", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "15px", backgroundColor: "#1d4ed8", color: "#fff", textAlign: "left", fontWeight: "600" }}>Full Name</th>
              <th style={{ padding: "15px", backgroundColor: "#1d4ed8", color: "#fff", textAlign: "left", fontWeight: "600" }}>Email</th>
              <th style={{ padding: "15px", backgroundColor: "#1d4ed8", color: "#fff", textAlign: "left", fontWeight: "600" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: "15px", textAlign: "center" }}>No registered users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff" }}>
                  <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>{user.fullName}</td>
                  <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>{user.email}</td>
                  <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
                    <button
                      style={{ padding: "6px 12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", backgroundColor: "#ef4444", color: "#fff" }}
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
