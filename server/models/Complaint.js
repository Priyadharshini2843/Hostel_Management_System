const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  category: {
    type: String,
    enum: ['Electrical', 'Plumbing', 'Furniture', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    default: 'Pending',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedDate: {
    type: Date,
  },
  repairNotes: {
    type: String,
  },
  completionTime: {
    type: Date,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
  },
  images: [
    {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
      originalName: {
        type: String,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
