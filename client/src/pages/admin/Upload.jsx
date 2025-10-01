import React, { useState } from "react";
import axios from "axios";

const UploadNotes = () => {
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !file) {
      alert("Please enter subject name and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },

      });

      alert(res.data.message);
      setSubject("");
      setFile(null);
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
      alert("❌ Error uploading note. Check backend logs.");
    }
  };

  return (
    <div className="container mt-5 p-4 shadow rounded" style={{ maxWidth: "500px", background: "#f8f9fa" }}>
      <h2 className="text-center mb-4">Upload Notes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Subject Name</label>
          <input
            type="text"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Upload File</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Upload</button>
      </form>
    </div>
  );
};

export default UploadNotes;
