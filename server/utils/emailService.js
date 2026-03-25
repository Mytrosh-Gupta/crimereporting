const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const statusColors = {
    Pending: '#f59e0b',
    'Under Investigation': '#3b82f6',
    Resolved: '#10b981',
};

const sendStatusUpdateEmail = async (userEmail, userName, complaintTitle, newStatus, adminRemarks) => {
    const color = statusColors[newStatus] || '#6b7280';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e3a5f, #0f2540); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px; }
        .header p { color: #93c5fd; margin: 6px 0 0; font-size: 13px; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 16px; }
        .status-badge { display: inline-block; background: ${color}22; color: ${color}; border: 1.5px solid ${color}; padding: 6px 18px; border-radius: 999px; font-weight: 700; font-size: 14px; margin: 8px 0 20px; }
        .card { background: #f9fafb; border-left: 4px solid ${color}; border-radius: 8px; padding: 18px 22px; margin: 20px 0; }
        .card-title { font-size: 12px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px; margin-bottom: 6px; }
        .card-value { font-size: 15px; color: #111827; font-weight: 600; }
        .remarks { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px; margin-top: 18px; font-size: 14px; color: #92400e; }
        .footer { background: #f9fafb; text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        .btn { display: inline-block; margin-top: 24px; padding: 12px 28px; background: linear-gradient(135deg, #1e3a5f, #2563eb); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ Crime Reporting System</h1>
          <p>Complaint Status Update Notification</p>
        </div>
        <div class="body">
          <p class="greeting">Hello <strong>${userName}</strong>,</p>
          <p style="color:#4b5563;font-size:15px;">Your complaint status has been updated:</p>
          <div>
            <span class="status-badge">${newStatus}</span>
          </div>
          <div class="card">
            <div class="card-title">Complaint</div>
            <div class="card-value">${complaintTitle}</div>
          </div>
          ${adminRemarks ? `<div class="remarks"><strong>Admin Remarks:</strong><br/>${adminRemarks}</div>` : ''}
          <p style="font-size:14px;color:#6b7280;margin-top:24px;">You can log into your account to view the full complaint details and track further updates.</p>
        </div>
        <div class="footer">
          This is an automated notification from the Online Crime Reporting System.<br/>
          Please do not reply to this email.
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Crime Reporting System" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Complaint Update: "${complaintTitle}" is now ${newStatus}`,
        html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendStatusUpdateEmail };
