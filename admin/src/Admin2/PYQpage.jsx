import React, { useState, useEffect } from "react";
import axios from "axios";

const PYQsPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [error, setError] = useState("");

  // Form states
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(""); // corrected setter

  const departments = ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  // Fetch PYQs
  useEffect(() => {
    const fetchPyqs = async () => {
      try {
        const res = await axios.get(
          "https://resource-allocator-backendservice.onrender.com/api/admin/pyqs",
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        const pyqsArray = Array.isArray(res.data) ? res.data : [];
        setPyqs(pyqsArray);
      } catch (err) {
        setError("Failed to fetch PYQs ❌");
      }
    };
    fetchPyqs();
  }, []);

  // Add PYQ
  const handleAddPyq = async (e) => {
    e.preventDefault();
    if (!department || !semester || !subject || !year || !file || !title) {
      setError("All fields are required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("year", year);
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await axios.post(
        "https://resource-allocator-backendservice.onrender.com/api/admin/pyqs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPyqs([res.data, ...pyqs]); // prepend new PYQ
      // Reset form
      setDepartment("");
      setSemester("");
      setSubject("");
      setYear("");
      setFile(null);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add PYQ ❌");
    }
  };

  // Delete PYQ
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PYQ?")) return;
    try {
      await axios.delete(`https://resource-allocator-backendservice.onrender.com/api/admin/pyqs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setPyqs(pyqs.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete PYQ ❌");
    }
  };

  // Styles
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
      <h1 style={headerStyle}>PYQs Management</h1>
      {error && <p style={{ color: "red", fontWeight: "600" }}>{error}</p>}

      {/* Form */}
      <form style={formStyle} onSubmit={handleAddPyq}>
        <select style={inputStyle} value={department} onChange={(e) => setDepartment(e.target.value)} required>
          <option value="">-- Choose Department --</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select style={inputStyle} value={semester} onChange={(e) => setSemester(e.target.value)} required>
          <option value="">Select Semester</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} required />
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} required />
        <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle} required />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={inputStyle} accept="application/pdf" required />

        <button type="submit" style={buttonStyle}>Add PYQ</button>
      </form>

      {/* Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Semester</th>
              <th style={thStyle}>Subject</th>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>File</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pyqs.length > 0 ? pyqs.map((p) => (
              <tr key={p._id}>
                <td style={tdStyle}>{p.department}</td>
                <td style={tdStyle}>{p.semester}</td>
                <td style={tdStyle}>{p.subject}</td>
                <td style={tdStyle}>{p.year}</td>
                <td style={tdStyle}>
                  <a href={p.fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
                </td>
                <td style={tdStyle}>
                  <button style={deleteButtonStyle} onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No PYQs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PYQsPage;
