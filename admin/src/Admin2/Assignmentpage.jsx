import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const departments = ["Computer", "Mechanical", "Civil", "Electrical"];
  const semesters = ["1","2","3","4","5","6","7","8"];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/api/admin/assignments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setAssignments(res.data.assignments);
      } catch (err) {
        setError("Failed to fetch assignments ❌");
      }
    };
    fetchAssignments();
  }, []);

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
      const res = await axios.post("/api/admin/assignments", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAssignments([res.data.assignment, ...assignments]);
      setDepartment(""); setSemester(""); setSubject(""); setTitle(""); setFile(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add assignment ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await axios.delete(`/api/admin/assignments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (err) {
      alert("Failed to delete assignment ❌");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Assignments Management</h1>
      {error && <p style={{ color:"red" }}>{error}</p>}

      <form onSubmit={handleAddAssignment}>
        <select value={department} onChange={e => setDepartment(e.target.value)} required>
          <option value="">--Department--</option>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={semester} onChange={e => setSemester(e.target.value)} required>
          <option value="">--Semester--</option>
          {semesters.map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="file" onChange={e => setFile(e.target.files[0])} accept="application/pdf" required />
        <button type="submit">Add Assignment</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Dept</th><th>Sem</th><th>Subject</th><th>Title</th><th>File</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a._id}>
              <td>{a.department}</td>
              <td>{a.semester}</td>
              <td>{a.subject}</td>
              <td>{a.title}</td>
              <td><a href={a.fileUrl} target="_blank" rel="noreferrer">View PDF</a></td>
              <td><button onClick={()=>handleDelete(a._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsPage;
