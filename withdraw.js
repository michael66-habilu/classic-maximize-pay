document.addEventListener('DOMContentLoaded', () => {
    const connectBankBtn = document.getElementById('connectBankBtn');
    const bankModal = document.getElementById('bankModal');
    const bankForm = document.getElementById('bankForm');
    const withdrawFormSection = document.getElementById('withdrawFormSection');
    
    // Connect bank button click
    if (connectBankBtn) {
        connectBankBtn.addEventListener('click', () => {
            bankModal.classList.remove('hidden');
        });
    }
    
    // Bank form submission
    if (bankForm) {
        bankForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('bankName').value;
            const phone = document.getElementById('bankPhone').value;
            const bank = document.getElementById('bankSelect').value;
            
            // Save bank info (in a real app, this would be saved to backend)
            localStorage.setItem('bankInfo', JSON.stringify({ name, phone, bank }));
            
            // Update display
            document.getElementById('displayName').textContent = name;
            document.getElementById('displayPhone').textContent = phone;
            document.getElementById('displayBank').textContent = bank;
            
            // Show withdraw form
            withdrawFormSection.classList.remove('hidden');
            document.getElementById('bankInfoSection').classList.add('hidden');
            bankModal.classList.add('hidden');
        });
    }
    
    // Edit bank info
    const editBankBtn = document.getElementById('editBankBtn');
    if (editBankBtn) {
        editBankBtn.addEventListener('click', () => {
            const bankInfo = JSON.parse(localStorage.getItem('bankInfo'));
            if (bankInfo) {
                document.getElementById('bankName').value = bankInfo.name;
                document.getElementById('bankPhone').value = bankInfo.phone;
                document.getElementById('bankSelect').value = bankInfo.bank;
            }
            
            bankModal.classList.remove('hidden');
        });
    }
    
    // Withdraw form submission
    const withdrawForm = document.getElementById('withdrawForm');
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const amount = document.getElementById('withdrawAmount').value;
            const bankInfo = JSON.parse(localStorage.getItem('bankInfo'));
            
            try {
                // In a real app, you would send this to your backend
                const response = await makeRequest('/withdraw', 'POST', {
                    amount,
                    bankInfo
                });
                
                alert('Withdrawal request submitted successfully! Please wait for admin approval.');
                window.location.href = 'home.html';
            } catch (error) {
                console.error('Withdrawal error:', error);
                alert('Failed to submit withdrawal: ' + error.message);
            }
        });
    }
});