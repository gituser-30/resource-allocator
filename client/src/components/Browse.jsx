import React from "react";
import { FaLaptopCode, FaProjectDiagram, FaBuilding, FaBolt } from "react-icons/fa";

const Browse = () => {
  const Branches = [
    {
      name: "Computer Engineering",
      icon: <FaLaptopCode size={40} />,
      gradient: "linear-gradient(135deg, #1e3c72, #2a5298)",
    },
    {
      name: "IT Engineering",
      icon: <FaProjectDiagram size={40} />,
      gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    },
    {
      name: "Civil Engineering",
      icon: <FaBuilding size={40} />,
      gradient: "linear-gradient(135deg, #e65c00, #f9d423)",
    },
    {
      name: "Electrical Engineering",
      icon: <FaBolt size={40} />,
      gradient: "linear-gradient(135deg, #ff512f, #dd2476)",
    },
  ];

  return (
    <div style={{ backgroundColor: "#0c2853ff", paddingBottom: "70px" }}>
      {/* Section Heading */}
      <div className="container text-light text-center" style={{ paddingTop: 45 }}>
        <span className="fw-bold fs-3">Browse by DBATU Scholars</span>
        <hr
          className="text-warning mx-auto"
          style={{
            width: "250px", // underline width
            height: "3px",  // thickness
            opacity: 1,
            marginTop: "12px",
            marginBottom: "50px", // spacing before cards
          }}
        />
      </div>

      {/* Cards Section */}
      <div className="container">
        <div className="row g-4 justify-content-center">
          {Branches.map((branch, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-lg border-0 h-100 text-center text-light"
                style={{
                  borderRadius: "20px",
                  cursor: "pointer",
                  background: branch.gradient,
                  transition: "all 0.4s ease-in-out",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.07) rotate(-2deg)";
                  e.currentTarget.style.boxShadow =
                    "0px 10px 25px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center py-4">
                  <div className="mb-3">{branch.icon}</div>
                  <h5 className="fw-bold mb-0">{branch.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
