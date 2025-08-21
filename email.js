// Simple email logger (in production, use nodemailer)
const emailLogger = {
    sendOTP: (email, username, otp) => {
        console.log(`📧 OTP Email to: ${email}`);
        console.log(`👤 Username: ${username}`);
        console.log(`🔢 OTP Code: ${otp}`);
        console.log('---');
        return { success: true, message: 'OTP logged to console' };
    },
    
    sendWelcome: (email, username) => {
        console.log(`📧 Welcome Email to: ${email}`);
        console.log(`👤 Username: ${username}`);
        console.log('🎉 Welcome to CLASSIC-MAXIMIZE-PAY!');
        console.log('---');
        return { success: true, message: 'Welcome email logged to console' };
    },
    
    sendTransaction: (email, username, transactionType, amount, status) => {
        console.log(`📧 Transaction Email to: ${email}`);
        console.log(`👤 Username: ${username}`);
        console.log(`💳 Type: ${transactionType}`);
        console.log(`💰 Amount: ${amount} TZS`);
        console.log(`📊 Status: ${status}`);
        console.log('---');
        return { success: true, message: 'Transaction email logged to console' };
    }
};

module.exports = emailLogger;