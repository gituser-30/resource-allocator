// controllers/assignmentcontroller.js
import Assignment from "../models/Assignment.js";

// ✅ Get all assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    return res.json({ success: true, assignments });
  } catch (error) {
    console.error("❌ Fetch Assignments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
      error: error.message,
    });
  }
};

// ✅ Add a new assignment
export const addAssignment = async (req, res) => {
  try {
    const { title, department, semester, subject } = req.body;

    // Validate input
    if (!title || !department || !semester || !subject) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate file upload
    if (!req.file || !req.file.path) {
      console.error("⚠️ File missing or upload failed:", req.file);
      return res
        .status(400)
        .json({ success: false, message: "File upload failed" });
    }

    // Create new assignment entry
    const newAssignment = new Assignment({
      title,
      department,
      semester,
      subject,
      fileUrl: req.file.path, // Cloudinary secure URL
    });

    await newAssignment.save();

    return res
      .status(201)
      .json({ success: true, message: "Assignment added successfully", assignment: newAssignment });
  } catch (error) {
    console.error("❌ Add Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add assignment",
      error: error.message,
    });
  }
};

// ✅ Delete an assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    return res.json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete assignment",
      error: error.message,
    });
  }
};

// ✅ Count assignments
export const getAssignmentCount = async (req, res) => {
  try {
    const count = await Assignment.countDocuments();
    return res.json({ success: true, count });
  } catch (error) {
    console.error("❌ Get Assignment Count Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignment count",
      error: error.message,
    });
  }
};
