document.addEventListener('DOMContentLoaded', async () => {
    // Load account data
    try {
        const response = await makeRequest('/user/account');
        const data = await response.json();
        
        if (response.ok) {
            // Update stats
            if (document.getElementById('dailyEarningsStat')) {
                document.getElementById('dailyEarningsStat').textContent = formatCurrency(data.dailyEarnings || 0);
            }
            
            if (document.getElementById('weeklyEarningsStat')) {
                document.getElementById('weeklyEarningsStat').textContent = formatCurrency(data.weeklyEarnings || 0);
            }
            
            if (document.getElementById('monthlyEarningsStat')) {
                document.getElementById('monthlyEarningsStat').textContent = formatCurrency(data.monthlyEarnings || 0);
            }
            
            if (document.getElementById('yearlyEarningsStat')) {
                document.getElementById('yearlyEarningsStat').textContent = formatCurrency(data.yearlyEarnings || 0);
            }
            
            if (document.getElementById('totalProfitStat')) {
                document.getElementById('totalProfitStat').textContent = formatCurrency(data.totalProfit || 0);
            }
            
            // Update account info
            if (document.getElementById('accountFullName')) {
                document.getElementById('accountFullName').textContent = data.user.fullName || 'N/A';
            }
            
            if (document.getElementById('accountUsername')) {
                document.getElementById('accountUsername').textContent = data.user.username || 'N/A';
            }
            
            if (document.getElementById('accountEmail')) {
                document.getElementById('accountEmail').textContent = data.user.email || 'N/A';
            }
            
            if (document.getElementById('accountPhone')) {
                document.getElementById('accountPhone').textContent = data.user.phone || 'N/A';
            }
            
            if (document.getElementById('accountJoinedDate')) {
                document.getElementById('accountJoinedDate').textContent = formatDate(data.user.createdAt) || 'N/A';
            }
        }
    } catch (error) {
        console.error('Failed to load account data:', error);
    }
});