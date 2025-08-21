document.addEventListener('DOMContentLoaded', async () => {
    // Load affiliate data
    try {
        const response = await makeRequest('/affiliate');
        const data = await response.json();
        
        if (response.ok) {
            // Update team counts
            if (document.getElementById('teamOneCount')) {
                document.getElementById('teamOneCount').textContent = data.teamOne.count || 0;
            }
            
            if (document.getElementById('teamOneEarnings')) {
                document.getElementById('teamOneEarnings').textContent = formatCurrency(data.teamOne.earnings || 0);
            }
            
            if (document.getElementById('teamTwoCount')) {
                document.getElementById('teamTwoCount').textContent = data.teamTwo.count || 0;
            }
            
            if (document.getElementById('teamTwoEarnings')) {
                document.getElementById('teamTwoEarnings').textContent = formatCurrency(data.teamTwo.earnings || 0);
            }
            
            if (document.getElementById('teamThreeCount')) {
                document.getElementById('teamThreeCount').textContent = data.teamThree.count || 0;
            }
            
            if (document.getElementById('teamThreeEarnings')) {
                document.getElementById('teamThreeEarnings').textContent = formatCurrency(data.teamThree.earnings || 0);
            }
            
            // Set invitation link with user's referral code
            if (document.getElementById('inviteLink')) {
                const inviteLink = `https://classic-maximize-pay.com/register?ref=${data.referralCode}`;
                document.getElementById('inviteLink').value = inviteLink;
            }
        }
    } catch (error) {
        console.error('Failed to load affiliate data:', error);
    }
    
    // Share buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('share-btn')) {
            const platform = e.target.classList.contains('whatsapp') ? 'WhatsApp' :
                           e.target.classList.contains('facebook') ? 'Facebook' :
                           e.target.classList.contains('instagram') ? 'Instagram' :
                           e.target.classList.contains('tiktok') ? 'TikTok' : 'Telegram';
            
            const inviteLink = document.getElementById('inviteLink').value;
            const message = `Join CLASSIC-MAXIMIZE PAY using my referral link: ${inviteLink}`;
            
            // In a real app, you would use platform-specific sharing APIs
            alert(`Sharing to ${platform}: ${message}`);
        }
    });
});