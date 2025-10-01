import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true); 

    // Fetch users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("adminToken"); 
            setIsLoading(true);

            if (!token) {
                setError("Authentication failed. Please log in again.");
                setIsLoading(false);
                return;
            }

            try {
                // 🎯 CACHE BUSTER: Add a unique timestamp query parameter
                // This guarantees the browser treats this request as new every time.
                const cacheBuster = `?t=${new Date().getTime()}`;
                
                // Request is sent to GET /api/admin/users?t=123456789
                const res = await axios.get(`http://localhost:5000/api/admin/users${cacheBuster}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        // Explicitly tell the browser NOT to cache this result
                        'Cache-Control': 'no-cache', 
                        'Pragma': 'no-cache',
                    },
                });

                // Check if the response data is a valid array before setting state
                if (!res.data || !Array.isArray(res.data.users)) {
                    setError("Server returned an invalid data format.");
                    setUsers([]);
                    return;
                }

                // Final successful step: Data is rendered
                setUsers(res.data.users); 
                setError(""); 

            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Failed to load user data. Your session may have expired (401 error).");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []); 

    // Delete user (Logic remains correct)
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        
        const token = localStorage.getItem("adminToken");
        if (!token) {
             alert("Session token is missing.");
             return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter((user) => user._id !== id));
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user ❌");
        }
    };

    // (Styling code omitted for brevity but should be included in your file)
    const containerStyle = {
        padding: "30px 40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#f3f6f9",
        minHeight: "100vh",
    };
    const headerStyle = {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "20px",
        color: "#1d4ed8",
    };
    const tableContainerStyle = {
        overflowX: "auto",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        background: "#fff",
    };
    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
    };
    const thStyle = {
        padding: "15px",
        backgroundColor: "#1d4ed8",
        color: "#fff",
        textAlign: "left",
        fontWeight: "600",
    };
    const tdStyle = {
        padding: "15px",
        borderBottom: "1px solid #ddd",
    };
    const actionButtonStyle = {
        padding: "6px 12px",
        marginRight: "8px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "all 0.3s",
    };
    const deleteButtonStyle = {
        ...actionButtonStyle,
        backgroundColor: "#ef4444",
        color: "#fff",
    };
    const errorStyle = {
        color: "red",
        textAlign: "center",
        marginBottom: "15px",
        fontWeight: "600",
    };
    const loadingStyle = {
        textAlign: "center",
        padding: "50px",
        color: "#1d4ed8"
    };

    if (isLoading) {
        return <div style={loadingStyle}>Loading registered users... </div>;
    }

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Registered Website Users ({users.length})</h1>

            {error && <p style={errorStyle}>{error}</p>}

            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Full Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ ...tdStyle, textAlign: "center" }}>
                                    No registered users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr
                                    key={user._id}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? "#f9fafb" : "#fff",
                                        cursor: "default",
                                    }}
                                >
                                    <td style={tdStyle}>{user.fullName}</td>
                                    <td style={tdStyle}>{user.email}</td>
                                    <td style={tdStyle}>
                                        <button style={deleteButtonStyle} onClick={() => handleDelete(user._id)}>
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
