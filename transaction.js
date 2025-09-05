// === Get User ID from Local Storage ===
const userId = localStorage.getItem("userId");
const rechargeTab = document.getElementById("rechargeTab");
const withdrawTab = document.getElementById("withdrawTab");

const rechargeHistoryDiv = document.getElementById("rechargeHistory");
const withdrawHistoryDiv = document.getElementById("withdrawHistory");

const rechargeBody = document.getElementById("rechargeBody");
const withdrawBody = document.getElementById("withdrawBody");

// Default show recharge tab
rechargeHistoryDiv.style.display = "block";

// Tab switching
rechargeTab.addEventListener("click", () => {
  rechargeHistoryDiv.style.display = "block";
  withdrawHistoryDiv.style.display = "none";
  rechargeTab.classList.add("active");
  withdrawTab.classList.remove("active");
});

withdrawTab.addEventListener("click", () => {
  rechargeHistoryDiv.style.display = "none";
  withdrawHistoryDiv.style.display = "block";
  withdrawTab.classList.add("active");
  rechargeTab.classList.remove("active");
});

// === Fetch Recharge History ===
async function loadRechargeHistory() {
  try {
    const res = await fetch(`https://classic-maximize-pay-e8ta.onrender.com/api/recharges/${userId}`);
    const data = await res.json();
    rechargeBody.innerHTML = "";

    if (data.length === 0) {
      rechargeBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No recharge history yet</td></tr>`;
      return;
    }

    data.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tx.transactionId}</td>
        <td>${tx.amount}</td>
        <td>${new Date(tx.createdAt).toLocaleString()}</td>
        <td>${tx.status}</td>
      `;
      rechargeBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching recharge history:", error);
    rechargeBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:red;">Error loading data</td></tr>`;
  }
}

// === Fetch Withdraw History ===
async function loadWithdrawHistory() {
  try {
    const res = await fetch(`https://classic-maximize-pay.onrender.com/api/withdraws/${userId}`);
    const data = await res.json();
    withdrawBody.innerHTML = "";

    if (data.length === 0) {
      withdrawBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No withdraw history yet</td></tr>`;
      return;
    }

    data.forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tx.transactionId}</td>
        <td>${tx.amount}</td>
        <td>${new Date(tx.createdAt).toLocaleString()}</td>
        <td>${tx.status}</td>
      `;
      withdrawBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching withdraw history:", error);
    withdrawBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:red;">Error loading data</td></tr>`;
  }
}

// === Initial Load ===
loadRechargeHistory();
loadWithdrawHistory();