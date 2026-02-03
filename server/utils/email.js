const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Create transporter using Gmail (or any SMTP service)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully to:', to);
        console.log('Message ID:', info.messageId);

        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Email sending failed:', error.message);

        // Fallback: Log to console if email fails
        console.log('\n=== EMAIL FALLBACK (Console) ===');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Message:', text);
        console.log('================================\n');

        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;
