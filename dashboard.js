const sidebar = document.getElementById("sidebar");

function toggleSidebar(){
  sidebar.style.left = sidebar.style.left === "0px" ? "-260px" : "0px";
}

function logout(){
  localStorage.removeItem("token");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}

// Button navigation
function goToRecharge(){ window.location.href = "recharge.html"; }
function goToWithdraw(){ window.location.href = "withdraw.html"; }
function goToTransactions(){ window.location.href = "transactions.html"; }

// ==== Dashboard Data Simulation ====
  async function loadDashboard(){
  const res = await fetch(`https://classic-maximize-pay-e8ta.onrender.com/api/userByUsername/${username}`);
  const user = await res.json();
  
  // Total Profit = all earnings from investments + affiliate (not reduced by recharge/purchase)
  document.getElementById("totalProfit").textContent = "TZS " + user.totalProfit.toLocaleString();
  
  // Balance = total earnings + referral earnings - withdraws
  document.getElementById("balance").textContent = "TZS " + user.balance.toLocaleString();
  
  // Daily earnings resets every 24h
  const lastLogin = localStorage.getItem("lastLoginTime");
  const now = new Date().getTime();
  if(!lastLogin || now - lastLogin > 24*60*60*1000){
    user.dailyEarnings = 0;
    localStorage.setItem("lastLoginTime", now);
    localStorage.setItem("user", JSON.stringify(user));
  }
  document.getElementById("dailyEarnings").textContent = "TZS " + user.dailyEarnings.toLocaleString();
  
  // Greeting
  const greetingEl = document.getElementById("greetingNotification");
  const hours = new Date().getHours();
  let greet = "";
  if(hours >=5 && hours <12) greet="Good Morning, " + user.fullname + "!";
  else if(hours>=12 && hours<17) greet="Good Afternoon, " + user.fullname + "!";
  else if(hours>=17 && hours<21) greet="Good Evening, " + user.fullname + "!";
  else greet="Good Night, " + user.fullname + "!";
  greetingEl.textContent = greet;
}

// Initial load
loadDashboard();