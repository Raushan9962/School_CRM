const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider here
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendCredentialsEmail = async (toEmail, studentName, studentUser, studentPass, parentUser, parentPass, isNewParent) => {
    try {
        let subject = 'Admission Approved - Your Login Credentials';
        let htmlContent = `
            <h3>Dear Parent,</h3>
            <p>Congratulations! The admission request for <strong>${studentName}</strong> has been approved.</p>
            <p>Below are your login credentials for the School CRM portal:</p>
            
            <h4>Student Login Details:</h4>
            <ul>
                <li>Username: <strong>${studentUser}</strong></li>
                <li>Password: <strong>${studentPass}</strong></li>
            </ul>
        `;

        if (isNewParent) {
            htmlContent += `
            <h4>Parent Login Details:</h4>
            <ul>
                <li>Username: <strong>${parentUser}</strong></li>
                <li>Password: <strong>${parentPass}</strong></li>
            </ul>
            `;
        } else {
            htmlContent += `
            <h4>Parent Login Details:</h4>
            <p>Your existing Parent account applies. Please use your current username and password.</p>
            `;
        }

        htmlContent += `<p>Please log in and change your passwords for security.</p><br/><p>Regards,<br/>School Admin</p>`;

        const info = await transporter.sendMail({
            from: `"School CRM" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent
        });

        console.log(`Credentials email sent to ${toEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const sendOTPEmail = async (toEmail, otp) => {
    try {
        let subject = 'School CRM - Password Reset OTP';
        let htmlContent = `
            <h3>Dear User,</h3>
            <p>You have requested to reset your password.</p>
            <p>Your OTP for password reset is: <strong>${otp}</strong></p>
            <p>This OTP is valid for a short time. Please do not share this with anyone.</p>
            <p>Regards,<br/>School Admin</p>
        `;

        const info = await transporter.sendMail({
            from: `"School CRM" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent
        });

        console.log(`OTP email sent to ${toEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

const sendGenericEmail = async (toEmail, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: `"School CRM" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent
        });
        console.log(`Generic email sent to ${toEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending generic email:', error);
        return false;
    }
};

module.exports = {
    sendCredentialsEmail,
    sendOTPEmail,
    sendGenericEmail
};
