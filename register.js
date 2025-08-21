document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Simple validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!/^[a-zA-Z0-9]+$/.test(username)) {
                alert('Username should only contain letters and numbers');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        username,
                        email,
                        phone,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }
                
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Registration error:', error);
                alert(error.message);
            }
        });
    }
});