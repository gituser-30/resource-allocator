import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

  // Form states
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  // Options
  const departments = [
    "Computer",
    "Mechanical",
    "Civil",
    "Electrical",
  ];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/assignments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });

        // backend may return { assignments: [] } or [] directly
        setAssignments(res.data.assignments || res.data);
      } catch (err) {
        setError("Failed to fetch assignments ❌");
      }
    };
    fetchAssignments();
  }, []);

  // Add assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!department || !semester || !subject || !file || !title) {
      setError("All fields are required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("title", title);
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/assignments", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAssignments([...assignments, res.data.assignment]); // ✅ add new assignment
      setDepartment(""); 
      setSemester(""); 
      setSubject(""); 
      setTitle(""); 
      setFile(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add assignment ❌");
    }
  };

  // Delete assignment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/assignments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setAssignments(assignments.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete assignment ❌");
    }
  };

  // Inline styles
  const containerStyle = { padding: "30px 40px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f3f6f9", minHeight: "100vh" };
  const headerStyle = { fontSize: "28px", fontWeight: "700", marginBottom: "20px", color: "#1d4ed8" };
  const formStyle = { marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" };
  const inputStyle = { width: "100%", padding: "12px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px" };
  const buttonStyle = { padding: "10px 16px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
  const tableContainerStyle = { overflowX: "auto", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", background: "#fff" };
  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thStyle = { padding: "15px", backgroundColor: "#1d4ed8", color: "#fff", textAlign: "left", fontWeight: "600" };
  const tdStyle = { padding: "15px", borderBottom: "1px solid #ddd" };
  const deleteButtonStyle = { backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Assignments Management</h1>

      {error && <p style={{ color: "red", fontWeight: "600" }}>{error}</p>}

      {/* Form */}
      <form style={formStyle} onSubmit={handleAddAssignment}>
        <select style={inputStyle} value={department} onChange={(e) => setDepartment(e.target.value)} required>
          <option value="">-- Choose Department --</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select style={inputStyle} value={semester} onChange={(e) => setSemester(e.target.value)} required>
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <input
          type="text"
          placeholder="Enter Subject Name"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
        />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={inputStyle} accept="application/pdf" required />
        <button type="submit" style={buttonStyle}>Add Assignment</button>
      </form>

      {/* Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Semester</th>
              <th style={thStyle}>Subject</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>File</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ ...tdStyle, textAlign: "center" }}>No assignments found</td>
              </tr>
            ) : (
              assignments.map((a, idx) => (
                <tr key={a._id} style={{ backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#fff" }}>
                  <td style={tdStyle}>{a.department}</td>
                  <td style={tdStyle}>{a.semester}</td>
                  <td style={tdStyle}>{a.subject}</td>
                  <td style={tdStyle}>{a.title}</td>
                  <td style={tdStyle}>
                    <a href={`http://localhost:5000${a.fileUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: "#1d4ed8", fontWeight: "600" }}>View PDF</a>
                  </td>
                  <td style={tdStyle}>
                    <button style={deleteButtonStyle} onClick={() => handleDelete(a._id)}>Delete</button>
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

export default AssignmentsPage;
