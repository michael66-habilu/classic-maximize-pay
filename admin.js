document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLoginSection = document.getElementById('adminLoginSection');
    
    // Check if admin is already logged in
    if (localStorage.getItem('adminToken')) {
        adminLoginSection.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        loadAdminData();
    }
    
    // Admin login
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/admin/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Admin login failed');
                }
                
                // Save admin token
                localStorage.setItem('adminToken', data.token);
                
                // Show dashboard
                adminLoginSection.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                loadAdminData();
            } catch (error) {
                console.error('Admin login error:', error);
                alert(error.message);
            }
        });
    }
    
    // Admin menu navigation
    const menuItems = document.querySelectorAll('.admin-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            document.querySelectorAll('.admin-section').forEach(s => {
                s.classList.remove('active');
            });
            document.getElementById(`${section}Section`).classList.add('active');
        });
    });
    
    // Save task button
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', async () => {
            const taskMessage = document.getElementById('taskMessage').value;
            
            try {
                const response = await makeRequest('/admin/task', 'POST', { message: taskMessage });
                alert('Daily task updated successfully!');
            } catch (error) {
                console.error('Failed to update task:', error);
                alert('Failed to update task: ' + error.message);
            }
        });
    }
    
    // Save notification button
    const saveNotificationBtn = document.getElementById('saveNotificationBtn');
    if (saveNotificationBtn) {
        saveNotificationBtn.addEventListener('click', async () => {
            const notificationMessage = document.getElementById('notificationMessage').value;
            
            try {
                const response = await makeRequest('/admin/notification', 'POST', { message: notificationMessage });
                alert('Daily notification updated successfully!');
            } catch (error) {
                console.error('Failed to update notification:', error);
                alert('Failed to update notification: ' + error.message);
            }
        });
    }
});

async function loadAdminData() {
    try {
        const response = await makeRequest('/admin/dashboard');
        const data = await response.json();
        
        if (response.ok) {
            // Update admin stats
            if (document.getElementById('totalInvested')) {
                document.getElementById('totalInvested').textContent = formatCurrency(data.totalInvested || 0);
            }
            
            if (document.getElementById('totalWithdrawn')) {
                document.getElementById('totalWithdrawn').textContent = formatCurrency(data.totalWithdrawn || 0);
            }
            
            if (document.getElementById('remainingBalance')) {
                document.getElementById('remainingBalance').textContent = formatCurrency(data.remainingBalance || 0);
            }
            
            // Load users
            if (document.getElementById('usersList')) {
                document.getElementById('usersList').innerHTML = data.users.map(user => `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${formatDate(user.joinedDate)}</td>
                        <td class="status-${user.status}">${user.status}</td>
                        <td>
                            <button class="btn btn-sm">Edit</button>
                            <button class="btn btn-sm">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
            
            // Load withdraw requests
            if (document.getElementById('withdrawRequestsList')) {
                document.getElementById('withdrawRequestsList').innerHTML = data.withdrawRequests.map(request => `
                    <tr>
                        <td>${request.username}</td>
                        <td>${formatCurrency(request.amount)}</td>
                        <td>${request.bank}</td>
                        <td>${formatDate(request.date)}</td>
                        <td class="status-${request.status}">${request.status}</td>
                        <td>
                            <button class="btn btn-sm approve-btn" data-id="${request.id}">Approve</button>
                            <button class="btn btn-sm reject-btn" data-id="${request.id}">Reject</button>
                            <button class="btn btn-sm delete-btn" data-id="${request.id}">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
            
            // Load recharge requests
            if (document.getElementById('rechargeRequestsList')) {
                document.getElementById('rechargeRequestsList').innerHTML = data.rechargeRequests.map(request => `
                    <tr>
                        <td>${request.username}</td>
                        <td>${formatCurrency(request.amount)}</td>
                        <td>${request.method}</td>
                        <td>${request.transactionId}</td>
                        <td>${formatDate(request.date)}</td>
                        <td class="status-${request.status}">${request.status}</td>
                        <td>
                            <button class="btn btn-sm approve-btn" data-id="${request.id}">Approve</button>
                            <button class="btn btn-sm reject-btn" data-id="${request.id}">Reject</button>
                            <button class="btn btn-sm delete-btn" data-id="${request.id}">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
            
            // Set current task and notification
            if (document.getElementById('taskMessage')) {
                document.getElementById('taskMessage').value = data.currentTask || '';
            }
            
            if (document.getElementById('notificationMessage')) {
                document.getElementById('notificationMessage').value = data.currentNotification || '';
            }
            
            // Set up action buttons
            document.addEventListener('click', async (e) => {
                if (e.target.classList.contains('approve-btn')) {
                    const id = e.target.getAttribute('data-id');
                    const type = e.target.closest('table').id.includes('withdraw') ? 'withdraw' : 'recharge';
                    
                    try {
                        const response = await makeRequest(`/admin/${type}/${id}/approve`, 'POST');
                        alert('Request approved successfully!');
                        loadAdminData();
                    } catch (error) {
                        console.error('Approval failed:', error);
                        alert('Failed to approve request: ' + error.message);
                    }
                }
                
                if (e.target.classList.contains('reject-btn')) {
                    const id = e.target.getAttribute('data-id');
                    const type = e.target.closest('table').id.includes('withdraw') ? 'withdraw' : 'recharge';
                    
                    try {
                        const response = await makeRequest(`/admin/${type}/${id}/reject`, 'POST');
                        alert('Request rejected successfully!');
                        loadAdminData();
                    } catch (error) {
                        console.error('Rejection failed:', error);
                        alert('Failed to reject request: ' + error.message);
                    }
                }
                
                if (e.target.classList.contains('delete-btn')) {
                    const id = e.target.getAttribute('data-id');
                    const type = e.target.closest('table').id.includes('withdraw') ? 'withdraw' : 'recharge';
                    
                    try {
                        const response = await makeRequest(`/admin/${type}/${id}`, 'DELETE');
                        alert('Request deleted successfully!');
                        loadAdminData();
                    } catch (error) {
                        console.error('Deletion failed:', error);
                        alert('Failed to delete request: ' + error.message);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Failed to load admin data:', error);
    }
}