document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgotForm');
    const otpSection = document.getElementById('otpSection');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to send OTP');
                }
                
                // Show OTP section
                otpSection.classList.remove('hidden');
                alert('OTP sent successfully!');
            } catch (error) {
                console.error('Forgot password error:', error);
                alert(error.message);
            }
        });
    }
    
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const otp = document.getElementById('otp').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmNewPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        otp,
                        newPassword
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Password reset failed');
                }
                
                alert('Password reset successfully! Please login with your new password.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Reset password error:', error);
                alert(error.message);
            }
        });
    }
});