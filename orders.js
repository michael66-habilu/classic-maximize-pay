document.addEventListener('DOMContentLoaded', async () => {
    // Load purchased orders
    try {
        const response = await makeRequest('/orders');
        const data = await response.json();
        
        if (response.ok && document.getElementById('orderItems')) {
            document.getElementById('orderItems').innerHTML = data.orders.map(order => `
                <div class="order-item">
                    <h4>${order.productName}</h4>
                    <p>Purchased: ${formatDate(order.purchaseDate)}</p>
                    <p>Price: ${formatCurrency(order.price)}</p>
                    <p>Daily Earnings: ${order.dailyEarnings}%</p>
                    <p>Status: <span class="status-${order.status}">${order.status}</span></p>
                </div>
            `).join('');
            
            // Update earnings progress
            if (document.getElementById('earningsProgress') && document.getElementById('earningsText')) {
                const progress = Math.min(100, (data.todayEarnings / data.dailyTarget) * 100);
                document.getElementById('earningsProgress').style.width = `${progress}%`;
                document.getElementById('earningsText').textContent = 
                    `${formatCurrency(data.todayEarnings)} earned today (${progress.toFixed(0)}% of daily target)`;
            }
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
});