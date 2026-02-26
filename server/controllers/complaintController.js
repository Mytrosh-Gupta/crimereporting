const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, location, dateOfIncident, isAnonymous } = req.body;

        if (!title || !description || !category || !location || !dateOfIncident) {
            return res
                .status(400)
                .json({ message: 'All required fields must be filled' });
        }

        const complaint = await Complaint.create({
            userId: req.user._id,
            title,
            description,
            category,
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

        // Users can only fetch their own complaints; admins can fetch any
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

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status;
        if (adminRemarks !== undefined) {
            complaint.adminRemarks = adminRemarks;
        }

        const updated = await complaint.save();
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

module.exports = {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus,
    deleteComplaint,
};
