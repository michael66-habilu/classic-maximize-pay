document.addEventListener('DOMContentLoaded', () => {
    const paymentMethods = document.querySelectorAll('.method');
    const paymentDetails = document.getElementById('paymentDetails');
    const productsSection = document.getElementById('productsSection');
    const transactionModal = document.getElementById('transactionModal');
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            const methodName = method.getAttribute('data-method');
            document.getElementById('selectedMethod').textContent = methodName.toUpperCase();
            
            // Set payment number based on method (in a real app, this would come from backend)
            let paymentNumber = '';
            switch(methodName) {
                case 'mpesa':
                    paymentNumber = '1234567890';
                    break;
                case 'selcom':
                    paymentNumber = '9876543210';
                    break;
                default:
                    paymentNumber = '1112223333';
            }
            
            document.getElementById('paymentNumber').textContent = paymentNumber;
            paymentDetails.classList.remove('hidden');
            productsSection.classList.add('hidden');
        });
    });
    
    // Recharge form submission
    const rechargeForm = document.getElementById('rechargeForm');
    if (rechargeForm) {
        rechargeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            paymentDetails.classList.add('hidden');
            productsSection.classList.remove('hidden');
        });
    }
    
    // Purchase button click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('purchase-btn')) {
            const productId = e.target.getAttribute('data-id');
            transactionModal.classList.remove('hidden');
        }
    });
    
    // Transaction form submission
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const transactionId = document.getElementById('transactionId').value;
            
            try {
                // In a real app, you would send this to your backend
                alert('Recharge request submitted successfully! Please wait for admin approval.');
                transactionModal.classList.add('hidden');
                window.location.href = 'home.html';
            } catch (error) {
                console.error('Transaction submission error:', error);
                alert('Failed to submit transaction: ' + error.message);
            }
        });
    }
});