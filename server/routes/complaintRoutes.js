const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus,
    deleteComplaint,
    getAnalytics,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const upload = require('../middleware/upload');

// User routes
router.post('/', protect, upload.single('evidenceFile'), createComplaint);
router.get('/my', protect, getMyComplaints);

// Admin routes
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/', protect, adminOnly, getAllComplaints);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);
router.delete('/:id', protect, adminOnly, deleteComplaint);

// Must be last (has :id param)
router.get('/:id', protect, getComplaintById);

module.exports = router;
