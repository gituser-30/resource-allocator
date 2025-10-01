import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer
      className="text-light pt-5 pb-3"
      style={{ backgroundColor: "#0d1117" }}
    >
      <div className="container">
        <div className="row text-center text-md-start">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-warning mb-3">Dbatu Scholar Hub</h4>
            <p style={{ fontSize: "15px", lineHeight: "1.8" }}>
              A one-stop platform for DBATU students to access{" "}
              <span className="text-warning fw-semibold">study materials</span>,{" "}
              <span className="text-warning fw-semibold">notes</span>,{" "}
              <span className="text-warning fw-semibold">assignments</span>, and{" "}
              <span className="text-warning fw-semibold">previous year papers</span>. 
              <br />
              Learn 📖 | Share 🤝 | Grow 🚀
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-warning mb-3">Quick Links</h4>
            <ul className="list-unstyled">
              {[
                { name: "🏠 Home", link: "/" },
                { name: "📚 Browse Notes", link: "/browse" },
                { name: "ℹ️ About Us", link: "/about" },
                { name: "✉️ Contact", link: "/contact" },
              ].map((item, idx) => (
                <li key={idx} className="mb-2">
                  <a
                    href={item.link}
                    className="text-decoration-none text-light"
                    style={{ transition: "color 0.3s" }}
                    onMouseEnter={(e) => (e.target.style.color = "#facc15")}
                    onMouseLeave={(e) => (e.target.style.color = "white")}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Social Media */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-warning mb-3">Connect with Us</h4>
            <p style={{ fontSize: "15px" }}>
              📧 dbatuscholarhub@gmail.com
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="#"
                className="text-light"
                style={{
                  fontSize: "20px",
                  transition: "color 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#0a66c2";
                  e.target.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "white";
                  e.target.style.transform = "scale(1)";
                }}
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://instagram.com/mandhare3243"
                className="text-light"
                style={{
                  fontSize: "20px",
                  transition: "color 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#e4405f";
                  e.target.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "white";
                  e.target.style.transform = "scale(1)";
                }}
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="bg-secondary" />

        {/* Copyright */}
        <div className="text-center">
          <p className="mb-0" style={{ fontSize: "14px" }}>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-warning fw-semibold">Dbatu Scholar Hub</span> | 
            All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
