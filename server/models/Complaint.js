const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Crime title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Theft', 'Cyber Fraud', 'Harassment', 'Missing Person', 'Assault', 'Other'],
        },
        summary: {
            type: String,
            default: '',
        },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium',
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        dateOfIncident: {
            type: Date,
            required: [true, 'Date of incident is required'],
        },
        evidenceFile: {
            type: String,
            default: null,
        },
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['Pending', 'Under Investigation', 'Resolved'],
            default: 'Pending',
        },
        adminRemarks: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
