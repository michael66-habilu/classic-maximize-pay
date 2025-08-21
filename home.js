document.addEventListener('DOMContentLoaded', async () => {
    // Load user data
    try {
        const response = await makeRequest('/user/me');
        const data = await response.json();
        
        if (response.ok) {
            // Update dashboard stats
            if (document.getElementById('totalProfit')) {
                document.getElementById('totalProfit').textContent = formatCurrency(data.totalProfit || 0);
            }
            
            if (document.getElementById('dailyEarnings')) {
                document.getElementById('dailyEarnings').textContent = formatCurrency(data.dailyEarnings || 0);
            }
            
            // Update notification with greeting
            if (document.getElementById('dailyNotification')) {
                const greeting = getGreeting();
                document.getElementById('dailyNotification').textContent = 
                    `${greeting}, ${data.user.username}! ${data.notification || 'Have a great day!'}`;
            }
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
});