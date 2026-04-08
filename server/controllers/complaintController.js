const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendStatusUpdateEmail } = require('../utils/emailService');
const { analyzeComplaint } = require('../utils/aiService');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
const createComplaint = async (req, res) => {
    try {
        const { title, description, location, dateOfIncident, isAnonymous } = req.body;

        if (!title || !description || !location || !dateOfIncident) {
            return res
                .status(400)
                .json({ message: 'All required fields must be filled' });
        }

        const aiData = await analyzeComplaint({ title, description, location });

        const complaint = await Complaint.create({
            userId: req.user._id,
            title,
            description,
            category: aiData.category,
            summary: aiData.summary,
            priority: aiData.priority,
            location,
            dateOfIncident,
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            evidenceFile: req.file ? req.file.filename : null,
        });

        res.status(201).json({
            message: 'Complaint submitted successfully',
            complaintId: complaint._id,
            complaint,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get complaints for logged-in user
// @route   GET /api/complaints/my
// @access  Private (User)
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single complaint by ID (user – must own it OR admin)
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate(
            'userId',
            'name email phone'
        );

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (
            req.user.role !== 'admin' &&
            complaint.userId._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all complaints (admin)
// @route   GET /api/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status and remarks (admin)
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin)
const updateComplaintStatus = async (req, res) => {
    try {
        const { status, adminRemarks } = req.body;

        const validStatuses = ['Pending', 'Under Investigation', 'Resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status;
        if (adminRemarks !== undefined) {
            complaint.adminRemarks = adminRemarks;
        }

        const updated = await complaint.save();

        // Send email notification (only for non-anonymous complaints)
        if (!complaint.isAnonymous && complaint.userId && complaint.userId.email) {
            // Send asynchronously (don't await) so the frontend doesn't hang for 60s
            // when Render's free tier blocks the outbound SMTP connection.
            sendStatusUpdateEmail(
                complaint.userId.email,
                complaint.userId.name,
                complaint.title,
                status,
                adminRemarks || ''
            ).catch(emailErr => {
                console.error('Email notification failed in background:', emailErr.message);
            });
        }

        res.json({ message: 'Complaint updated successfully', complaint: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete complaint (admin)
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        await complaint.deleteOne();
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics data (admin)
// @route   GET /api/complaints/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
    try {
        // Totals by status
        const byStatus = await Complaint.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        // Totals by category
        const byCategory = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const byMonth = await Complaint.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const formattedByMonth = byMonth.map((item) => ({
            month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            count: item.count,
        }));

        const total = await Complaint.countDocuments();

        res.json({
            total,
            byStatus: byStatus.map((s) => ({ name: s._id, value: s.count })),
            byCategory: byCategory.map((c) => ({ name: c._id, value: c.count })),
            byMonth: formattedByMonth,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus,
    deleteComplaint,
    getAnalytics,
};
