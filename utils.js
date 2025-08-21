// Utility functions used across the application
const API_BASE_URL = window.location.origin + '/api';

// Check if user is logged in
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
            headers: {
                'x-auth-token': localStorage.getItem('token') || ''
            }
        });
        
        const data = await response.json();
        
        if (!data.isLoggedIn && !window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.includes('forgot.html') &&
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
            return false;
        }
        
        return data.isLoggedIn;
    } catch (error) {
        console.error('Auth check failed:', error);
        
        // Allow access to auth pages even if API is down
        if (!window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.includes('forgot.html') &&
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
        
        return false;
    }
}

// Make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || ''
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        
        // Handle HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Try to parse JSON response
        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            return { success: true }; // Return empty success for non-JSON responses
        }
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// ... (rest of the utils.js remains the same)