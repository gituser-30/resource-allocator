import React from "react";
import { NavLink } from "react-router-dom";
const Popular = () => {
  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "linear-gradient(135deg, #0f2027, #000304ff, #010709ff)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ---------------- Featured Notes ---------------- */}
      <h2 className="text-center fw-bold mb-4" style={{ color: "#90e0ef" }}>
  🌟 Featured Notes
</h2>

<div className="row g-4 justify-content-center">
  {[
    {
      id: 1,
      subject: "DBMS",
      unit: "Unit 1",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP6alUrn9jJxQKo0OM236ekOxLmep3dPnK-g&s",
      description: "📖 Second Year - Database Management System",
    },
    {
      id: 2,
      subject: "Operating System",
      unit: "Unit 2",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_0hzZQ_ZgZQa09fQLKnrsL37fX0hgI3Z15g&s",
      description: "🖥️ Second Year - Operating System",
    },
    {
      id: 3,
      subject: "Computer Networks",
      unit: "Unit 3",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmR4RBb4KR2F8smhdxiPTRDjezKjiW53zGUQ&s",
      description: "🌐 Second Year - Computer Networks",
    },
  ].map((note) => (
    <div className="col-md-4 col-sm-6" key={note.id}>
      <div
        className="card shadow border-0 h-100"
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "14px",
          backdropFilter: "blur(12px)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
        }}
      >
        <div className="card-body text-center">
          <img
            src={note.img}
            alt={`${note.subject} Notes`}
            className="img-fluid rounded mb-3"
            style={{
              maxHeight: "180px",
              borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.4)",
            }}
          />
          <h5 className="card-title fw-bold text-info">
            {note.subject} - {note.unit} Notes
          </h5>
          <p className="card-text small text-light">{note.description}</p>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* ---------------- Featured Assignments ---------------- */}
      <h2
        className="text-center fw-bold mt-5 mb-4"
        style={{ color: "#90ee90" }}
      >
        📝 Featured Assignments
      </h2>

      <div className="row g-4 justify-content-center">
        {[1, 2, 3].map((assign) => (
          <div className="col-md-4 col-sm-6" key={assign}>
            <div
              className="card shadow border-0 h-100"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "14px",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
              }}
            >
              <div className="card-body text-center">
                <img
                  src={`https://cdn-icons-png.flaticon.com/512/3135/31357${
                    10 + assign
                  }.png`}
                  alt="Assignment"
                  className="img-fluid rounded mb-3"
                  style={{
                    maxHeight: "150px",
                    borderRadius: "10px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.4)",
                  }}
                />
                <h5 className="card-title fw-bold text-success">
                  DSA Notes {assign}
                </h5>
                <p className="card-text small text-light">
                  📝 Second Year - Data Structure & Algorithm
                </p>
                <div className="d-flex justify-content-center gap-2 mt-2">
                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Video Tutorials ---------------- */}
      <h2
        className="text-center fw-bold mt-5 mb-4"
        style={{ color: "#ff6b6b" }}
      >
        🎥 Video Tutorials
      </h2>
      <div className="row g-4 justify-content-center">
        {[
          "https://www.youtube.com/embed/videoseries?si=ntB57z6TnMFAXMfC&amp;list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
          "https://www.youtube.com/embed/tVzUXW6siu0?si=6tpffHiXeG-kfbmV",
          "https://www.youtube.com/embed/videoseries?si=bmD1NzfMB7gMhcT5&amp;list=PLjwm_8O3suyOFd8LTFqgw9v7MqPNtgINA",
          "https://www.youtube.com/embed/LvC68w9JS4Y?si=j2_HAX1Aad0UCPQT",
          "https://www.youtube.com/embed/videoseries?si=mgNT8Cg8HWUPRijH&amp;list=PLC36xJgs4dxEYmhzVBW7nBdftFZ4xmiF1",
        ].map((vid) => (
          <div className="col-md-4 col-sm-6" key={vid}>
            <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
              <iframe src={vid} title="YouTube video" allowFullScreen></iframe>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Popular;
