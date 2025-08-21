// Utility functions used across the application
const API_BASE_URL = 'https://your-railway-app-url.com/api';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.includes('login.html') &&
        !window.location.pathname.includes('register.html') &&
        !window.location.pathname.includes('forgot.html') &&
        !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
}

// Make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

// Initialize sidebar toggle
function initSidebarToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
}

// Initialize logout button
function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
}

// Initialize admin logout button
function initAdminLogoutButton() {
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            window.location.href = 'admin.html';
        });
    }
}

// Initialize copy buttons
function initCopyButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'copyBtn' || e.target.id === 'copyInviteBtn') {
            const input = e.target.previousElementSibling;
            input.select();
            document.execCommand('copy');
            
            // Show tooltip
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Copied!';
            e.target.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        }
    });
}

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab button
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Update active tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}Tab`).classList.add('active');
            });
        });
    }
}

// Initialize modals
function initModals() {
    document.addEventListener('click', (e) => {
        // Open modal
        if (e.target.classList.contains('view-team-btn')) {
            const level = e.target.getAttribute('data-level');
            document.getElementById('teamModalTitle').textContent = `Team Level ${level} Members`;
            document.getElementById('teamModal').classList.remove('hidden');
        }
        
        // Close modal
        if (e.target.classList.contains('close-team-modal')) {
            document.getElementById('teamModal').classList.add('hidden');
        }
        
        if (e.target.id === 'viewTaskBtn') {
            document.getElementById('taskModal').classList.remove('hidden');
        }
        
        if (e.target.id === 'completeTaskBtn') {
            document.getElementById('taskModal').classList.add('hidden');
            alert('Task completed! Your earnings will be updated.');
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initSidebarToggle();
    initLogoutButton();
    initAdminLogoutButton();
    initCopyButtons();
    initTabs();
    initModals();
    
    // Display username if available
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && document.getElementById('usernameDisplay')) {
        document.getElementById('usernameDisplay').textContent = user.username;
    }
});