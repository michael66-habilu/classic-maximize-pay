const nodemailer = require('nodemailer');

// Email configuration (using Gmail as example)
const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Send OTP email
async function sendOTPEmail(email, username, otp) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@classic-maximize-pay.com',
            to: email,
            subject: 'Your OTP Code - CLASSIC-MAXIMIZE-PAY',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffc107; text-align: center;">CLASSIC-MAXIMIZE-PAY</h2>
                    <div style="background: #f4f4f4; padding: 20px; border-radius: 10px;">
                        <h3>Password Reset OTP</h3>
                        <p>Hello ${username},</p>
                        <p>Your OTP code for password reset is:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #ffc107; letter-spacing: 5px;">
                                ${otp}
                            </span>
                        </div>
                        <p>This OTP will expire in 10 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                    <p style="text-align: center; color: #666; margin-top: 20px;">
                        © ${new Date().getFullYear()} CLASSIC-MAXIMIZE-PAY. All rights reserved.
                    </p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
}

// Send welcome email
async function sendWelcomeEmail(email, username) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'welcome@classic-maximize-pay.com',
            to: email,
            subject: 'Welcome to CLASSIC-MAXIMIZE-PAY!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffc107; text-align: center;">Welcome to CLASSIC-MAXIMIZE-PAY!</h2>
                    <div style="background: #f4f4f4; padding: 20px; border-radius: 10px;">
                        <h3>Hello ${username},</h3>
                        <p>Thank you for joining CLASSIC-MAXIMIZE-PAY!</p>
                        <p>Your account has been successfully created and you can now:</p>
                        <ul>
                            <li>Invest in various plans</li>
                            <li>Earn daily profits</li>
                            <li>Invite friends and earn commissions</li>
                            <li>Withdraw your earnings easily</li>
                        </ul>
                        <p>Start your investment journey today and maximize your earnings!</p>
                    </div>
                    <p style="text-align: center; color: #666; margin-top: 20px;">
                        © ${new Date().getFullYear()} CLASSIC-MAXIMIZE-PAY. All rights reserved.
                    </p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Welcome email error:', error);
        return { success: false, error: error.message };
    }
}

// Send transaction notification
async function sendTransactionEmail(email, username, transactionType, amount, status) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'transactions@classic-maximize-pay.com',
            to: email,
            subject: `Transaction ${status} - ${transactionType}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffc107; text-align: center;">Transaction Notification</h2>
                    <div style="background: #f4f4f4; padding: 20px; border-radius: 10px;">
                        <h3>Hello ${username},</h3>
                        <p>Your ${transactionType} transaction has been <strong>${status}</strong>.</p>
                        <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p><strong>Amount:</strong> ${amount} TZS</p>
                            <p><strong>Type:</strong> ${transactionType}</p>
                            <p><strong>Status:</strong> ${status}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        <p>Thank you for using CLASSIC-MAXIMIZE-PAY.</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Transaction email error:', error);
        return { success: false, error: error.message };
    }
}

// Verify email configuration
async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('Email configuration is correct');
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
}

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    sendTransactionEmail,
    verifyEmailConfig,
    transporter
};