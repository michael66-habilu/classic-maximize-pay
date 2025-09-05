// ===== myAccount.js =====

const accUserId = localStorage.getItem("userId"); // assumed stored on login

// ===== Fetch User Account Info =====
async function loadAccount() {
  try {
    const res = await fetch(`https://classic-maximize-pay-e8ta.onrender.com/api/user/${accUserId}`);
    const user = await res.json();

    document.getElementById("username").textContent = user.username;
    document.getElementById("email").textContent = user.email;
    document.getElementById("phone").textContent = user.phone;
    document.getElementById("balance").textContent = `TZS ${user.balance.toLocaleString()}`;
    document.getElementById("dailyEarnings").textContent = `TZS ${user.dailyEarnings.toLocaleString()}`;
    document.getElementById("totalProfit").textContent = `TZS ${user.totalProfit.toLocaleString()}`;
  } catch (error) {
    console.error("Error loading account info:", error);
  }
}

// ===== Claim Daily Earnings =====
async function claimDailyEarnings() {
  try {
    const res = await fetch(`https://classic-maximize-pay-e8ta.onrender.com/api/claim-daily`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: accUserId })
    });
    const data = await res.json();
    if(data.msg) alert(data.msg);

    // Refresh account info
    loadAccount();
  } catch (error) {
    console.error("Error claiming daily earnings:", error);
  }
}

// ===== Contact Support =====
function contactSupport() {
  const message = encodeURIComponent("Hello, I need assistance regarding my account.");
  window.open(`https://wa.me/${supportNumber}?text=${message}`, "_blank");
}

// ===== Toggle guidance list =====
function toggleGuidance() {
  const list = document.getElementById("guidanceList");
  list.style.display = list.style.display === "block" ? "none" : "block";
}

// ===== Initial load =====
loadAccount();