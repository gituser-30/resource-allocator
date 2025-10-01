import React, { useState, useEffect } from "react";
import axios from "axios";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  // Form states
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null); 
  const [title, settittle] = useState(""); 

  // Options
  const departments = [
    "Computer",
    "Mechanical",
    "Civil",
    "Electrical",
  ];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/notes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });

        // Sometimes backend returns array directly, sometimes inside {notes: []}
        setNotes(res.data.notes || res.data);
      } catch (err) {
        setError("Failed to fetch notes ❌");
      }
    };
    fetchNotes();
  }, []);

  // Add note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!department || !semester || !subject || !file) {
      setError("All fields are required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/notes", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNotes([...notes, res.data.note]); // add new note
      setDepartment(""); setSemester(""); setSubject(""); setFile(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add note ❌");
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      alert("Failed to delete note ❌");
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
      <h1 style={headerStyle}>Notes Management</h1>

      {error && <p style={{ color: "red", fontWeight: "600" }}>{error}</p>}

      {/* Form */}
      <form style={formStyle} onSubmit={handleAddNote}>
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
          placeholder="title"
          value={title}
          onChange={(e) => settittle(e.target.value)}
          style={inputStyle}
          required
        />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={inputStyle} accept="application/pdf" required />
        <button type="submit" style={buttonStyle}>Add Note</button>
      </form>

      {/* Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Semester</th>
              <th style={thStyle}>Subject</th>
              <th style={thStyle}>File</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...tdStyle, textAlign: "center" }}>No notes found</td>
              </tr>
            ) : (
              notes.map((n, idx) => (
                <tr key={n._id} style={{ backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#fff" }}>
                  <td style={tdStyle}>{n.department}</td>
                  <td style={tdStyle}>{n.semester}</td>
                  <td style={tdStyle}>{n.subject}</td>
                  <td style={tdStyle}>
                    <a href={`http://localhost:5000${n.fileUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: "#1d4ed8", fontWeight: "600" }}>View PDF</a>
                  </td>
                  <td style={tdStyle}>
                    <button style={deleteButtonStyle} onClick={() => handleDelete(n._id)}>Delete</button>
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

export default NotesPage;
