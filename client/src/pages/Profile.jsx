import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({});
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const navigate = useNavigate();

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setForm(parsedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Update profile
  const handleProfileUpdate = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) {
        alert("User ID missing, please login again.");
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/update-profile/${userId}`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setShowEdit(false);
        alert("Profile updated successfully ✅");
      } else {
        alert(res.data.msg || "Update failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    }
  };

  // Change password
  const handleChangePassword = async () => {
    try {
      const userId = user._id || user.id;
      if (!userId) {
        alert("User ID missing, please login again.");
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/change-password/${userId}`,
        passwordData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        alert("Password changed successfully ✅");
        setShowPassword(false);
      } else {
        alert(res.data.msg || "Password change failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error changing password ❌");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card shadow-lg">
        {/* Header */}
        <div className="profile-header text-center">
         <div className="profile-avatar">
            <img
              src={
                user.profilePhoto
                  ? `http://localhost:5000/uploads/profiles/${user.profilePhoto}`
                  : "/images/default-avatar.png"
              }
              alt="Profile"
            />
          </div>

          <h2 className="fw-bold text-light">{user.fullName}</h2>
          <p className="text-muted">{user.email}</p>
        </div>

        {/* Info */}
        <div className="profile-info">
          <h5 className="section-title">👤 Personal Information</h5>
          <ul className="list-unstyled">
            <li><strong>📛 Name:</strong> {user.fullName}</li>
            <li><strong>📧 Email:</strong> {user.email}</li>
            <li><strong>🎂 Date of Birth:</strong> {user.dob || "Not provided"}</li>
            <li><strong>🎓 Department:</strong> {user.department || "Not updated"}</li>
            <li><strong>📅 Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="profile-actions d-flex justify-content-between">
          <button className="btn btn-outline-info w-100 me-2" onClick={() => setShowEdit(true)}>✏️ Edit Profile</button>
          <button className="btn btn-outline-warning w-100 me-2" onClick={() => setShowPassword(true)}>🔑 Change Password</button>
          <button className="btn btn-danger w-100" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Edit Profile</h3>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Department"
              value={form.department || ""}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <input
              type="date"
              className="form-control mb-2"
              value={form.dob || ""}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setShowEdit(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleProfileUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPassword && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Change Password</h3>
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setShowPassword(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleChangePassword}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
