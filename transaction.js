document.addEventListener('DOMContentLoaded', async () => {
    // Load transaction history
    try {
        const response = await makeRequest('/transactions');
        const data = await response.json();
        
        if (response.ok) {
            // Populate recharge history
            const rechargeHistory = document.getElementById('rechargeHistory');
            if (rechargeHistory && data.rechargeHistory) {
                rechargeHistory.innerHTML = data.rechargeHistory.map(transaction => `
                    <tr>
                        <td>${formatDate(transaction.date)}</td>
                        <td>${formatCurrency(transaction.amount)}</td>
                        <td>${transaction.method}</td>
                        <td class="status-${transaction.status}">${transaction.status}</td>
                    </tr>
                `).join('');
            }
            
            // Populate withdraw history
            const withdrawHistory = document.getElementById('withdrawHistory');
            if (withdrawHistory && data.withdrawHistory) {
                withdrawHistory.innerHTML = data.withdrawHistory.map(transaction => `
                    <tr>
                        <td>${formatDate(transaction.date)}</td>
                        <td>${formatCurrency(transaction.amount)}</td>
                        <td>${transaction.bank}</td>
                        <td class="status-${transaction.status}">${transaction.status}</td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Failed to load transaction history:', error);
    }
});