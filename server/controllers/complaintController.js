const Complaint = require('../models/Complaint');

// @desc    Get all complaints (Admin) or User's complaints (Student)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await Complaint.find({})
        .populate('createdBy', 'name email roomNumber hostel')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'employee') {
      complaints = await Complaint.find({ assignedTo: req.user._id })
        .populate('createdBy', 'name email roomNumber hostel')
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ createdBy: req.user._id })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  const { title, description, priority, category } = req.body;

  try {
    const complaint = new Complaint({
      title,
      description,
      priority: priority || 'Low',
      category: category || 'Other',
      createdBy: req.user._id,
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  const { status, repairNotes } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status;
      if (repairNotes) {
        complaint.repairNotes = repairNotes;
      }
      if (status === 'Resolved') {
        complaint.completionTime = Date.now();
      }
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      await complaint.deleteOne();
      res.json({ message: 'Complaint removed' });
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign a complaint to an employee
// @route   PUT /api/complaints/:id/assign
// @access  Private/Admin
const assignComplaint = async (req, res) => {
  const { employeeId } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.assignedTo = employeeId;
      complaint.assignedBy = req.user._id;
      complaint.assignedDate = Date.now();
      complaint.status = 'Assigned';
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add feedback and rating to a complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private/Student
const addFeedback = async (req, res) => {
  const { rating, feedback } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      if (complaint.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to add feedback to this complaint' });
      }
      if (complaint.status !== 'Resolved') {
        return res.status(400).json({ message: 'Complaint is not resolved yet' });
      }

      complaint.rating = rating;
      complaint.feedback = feedback;
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getComplaints,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
  assignComplaint,
  addFeedback,
};
