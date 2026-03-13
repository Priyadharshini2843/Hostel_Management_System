const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaintStatus, deleteComplaint, assignComplaint, addFeedback } = require('../controllers/complaintController');
const { protect, admin, employee } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getComplaints)
  .post(protect, createComplaint);

router.route('/:id')
  .delete(protect, admin, deleteComplaint);

router.route('/:id/status')
  .put(protect, employee, updateComplaintStatus);

router.route('/:id/assign')
  .put(protect, admin, assignComplaint);

router.route('/:id/feedback')
  .post(protect, addFeedback);

module.exports = router;
