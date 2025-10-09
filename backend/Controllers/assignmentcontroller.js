import Assignment from "../models/Assignment.js";

// Get all assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    console.error("Fetch Assignments Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assignments" });
  }
};

// Add assignment
export const addAssignment = async (req, res) => {
  try {
    const { title, department, semester, subject } = req.body;

    if (!title || !department || !semester || !subject) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "File upload failed" });
    }

    const newAssignment = new Assignment({
      title,
      department,
      semester,
      subject,
      fileUrl: req.file.path, // Cloudinary URL
    });

    await newAssignment.save();
    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (error) {
    console.error("Add Assignment Error:", error);
    res.status(500).json({ success: false, message: "Failed to add assignment" });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    res.json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete Assignment Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete assignment" });
  }
};

// Count assignments
export const getAssignmentCount = async (req, res) => {
  try {
    const count = await Assignment.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    console.error("Get Assignment Count Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assignment count" });
  }
};
