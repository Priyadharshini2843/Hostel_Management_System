const nodemailer = require('nodemailer');

let transporter;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const getTransporter = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
};

const sendComplaintResolvedEmail = async (complaint) => {
  const mailer = getTransporter();
  const student = complaint.createdBy;
  const { SMTP_USER, MAIL_FROM } = process.env;

  if (!student?.email) {
    return { sent: false, reason: 'Student email is missing' };
  }

  if (!mailer) {
    return { sent: false, reason: 'SMTP settings are incomplete' };
  }

  const studentName = student.name || 'Student';
  const safeStudentName = escapeHtml(studentName);
  const safeTitle = escapeHtml(complaint.title);
  const safeRepairNotes = escapeHtml(complaint.repairNotes);

  await mailer.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to: student.email,
    subject: `Your complaint "${complaint.title}" has been resolved`,
    text: [
      `Hello ${studentName},`,
      '',
      `Your complaint "${complaint.title}" has been marked as resolved.`,
      complaint.repairNotes ? `Repair notes: ${complaint.repairNotes}` : null,
      '',
      'Please log in to the hostel management portal to review the work and share feedback.',
      '',
      'Hostel Management Team',
    ].filter(Boolean).join('\n'),
    html: `
      <p>Hello ${safeStudentName},</p>
      <p>Your complaint <strong>${safeTitle}</strong> has been marked as resolved.</p>
      ${complaint.repairNotes ? `<p><strong>Repair notes:</strong> ${safeRepairNotes}</p>` : ''}
      <p>Please log in to the hostel management portal to review the work and share feedback.</p>
      <p>Hostel Management Team</p>
    `,
  });

  return { sent: true };
};

module.exports = {
  sendComplaintResolvedEmail,
};
