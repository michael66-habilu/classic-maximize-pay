const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

// Generate OTP (6 digits)
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs in memory (in production, use Redis or database)
const otpStore = new Map();

// Store OTP with timestamp
function storeOTP(username, otp) {
    otpStore.set(username, {
        otp: otp,
        expiresAt: Date.now() + OTP_EXPIRY_TIME
    });
    
    // Auto-cleanup after expiry
    setTimeout(() => {
        if (otpStore.get(username)?.otp === otp) {
            otpStore.delete(username);
        }
    }, OTP_EXPIRY_TIME);
}

// Verify OTP
function verifyOTP(username, otp) {
    const storedData = otpStore.get(username);
    
    if (!storedData) {
        return { success: false, message: 'OTP not found or expired' };
    }
    
    if (Date.now() > storedData.expiresAt) {
        otpStore.delete(username);
        return { success: false, message: 'OTP has expired' };
    }
    
    if (storedData.otp !== otp) {
        return { success: false, message: 'Invalid OTP' };
    }
    
    // OTP is valid, remove it
    otpStore.delete(username);
    return { success: true, message: 'OTP verified successfully' };
}

// Get remaining time for OTP
function getOTPExpiryTime(username) {
    const storedData = otpStore.get(username);
    if (!storedData) return 0;
    
    return Math.max(0, storedData.expiresAt - Date.now());
}

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP,
    getOTPExpiryTime,
    OTP_EXPIRY_TIME
};