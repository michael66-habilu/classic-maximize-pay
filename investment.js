document.addEventListener('DOMContentLoaded', () => {
    // Investment form submission
    const investmentForms = document.querySelectorAll('.investment-form');
    
    investmentForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const planId = form.getAttribute('data-id');
            const amount = form.querySelector('input').value;
            
            // In a real app, you would send this to your backend
            alert(`Investment of ${formatCurrency(amount)} submitted for plan ${planId}`);
            
            // Hide form and show countdown/claim button
            form.classList.add('hidden');
            document.getElementById(`countdown${planId}`).classList.remove('hidden');
            form.nextElementSibling.classList.remove('hidden');
            
            // Start countdown (simplified for demo)
            const countdownElement = document.getElementById(`time${planId}`);
            let days = planId === '1' ? 5 : 
                      planId === '2' ? 10 : 
                      planId === '3' ? 12 : 
                      planId === '4' ? 20 : 30;
            
            const interval = setInterval(() => {
                days--;
                countdownElement.textContent = `${days} day${days !== 1 ? 's' : ''}`;
                
                if (days <= 0) {
                    clearInterval(interval);
                    countdownElement.textContent = 'Ready to claim!';
                }
            }, 1000);
        });
    });
    
    // Claim button click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('claim-btn')) {
            const planId = e.target.getAttribute('data-id');
            alert(`Profit claimed for plan ${planId}!`);
            
            // Reset the investment UI
            e.target.classList.add('hidden');
            document.getElementById(`countdown${planId}`).classList.add('hidden');
            document.querySelector(`.investment-form[data-id="${planId}"]`).classList.remove('hidden');
        }
    });
});