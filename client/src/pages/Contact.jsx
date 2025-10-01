import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Sending...");

    try {
      const res = await axios.post("http://localhost:5000/contact", formData);
      if (res.data.success) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error sending message.");
    }
  };

  return (
    <div className="container-fluid" style={{background:"#1f2937"}}>
    <div className="container py-5 text-light">
      {/* Heading */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 text-warning">📩 Contact Us</h1>
        <p className="text-secondary fs-5">
          Have questions or suggestions? We’d love to hear from you!
        </p>
      </div>

      <div className="row g-4">
        {/* Contact Form */}
        <div className="col-lg-6">
          <div
            className="card shadow-lg p-4 border-0 h-100"
            style={{ background: "#0d1117", borderRadius: "15px" }}
          >
            <h4 className="text-warning mb-4">Send us a message</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Your Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "10px" }}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-warning w-100 fw-bold"
                style={{
                  borderRadius: "10px",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "#ffc107", e.target.style.color = "black")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "#ffb703", e.target.style.color = "white")
                }
              >
                🚀 Send Message
              </button>
            </form>
            {status && <p className="mt-3 text-center">{status}</p>}
          </div>
        </div>

        {/* Contact Info / Map */}
        <div className="col-lg-6">
          <div
            className="card shadow-lg p-4 border-0 h-100"
            style={{ background: "#0d1117", borderRadius: "15px" }}
          >
            <h4 className="text-warning mb-4">Get in touch</h4>
            <p className="mb-2">
              <strong>📧 Email:</strong> dbatuscholorhub@gmail.com
            </p>
            <p className="mb-2">
              <strong>📞 Phone:</strong> +91 8856032177, 9561017209
            </p>
            <p className="mb-2">
              <strong>📍 Address:</strong> Dr. Babasaheb Ambedkar
              Technological University, Lonere
            </p>

            {/* Map Embed */}
            <div className="ratio ratio-16x9 mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4116.649812631768!2d73.33595807552913!3d18.169820082857015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be82e9b091399f5%3A0x2fac4343fa1e3cae!2sDr.%20Babasaheb%20Ambedkar%20Technological%20University!5e1!3m2!1sen!2sin!4v1757405076420!5m2!1sen!2sin"
                title="DBATU Location"
                style={{ border: 0, borderRadius: "10px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Contact;
