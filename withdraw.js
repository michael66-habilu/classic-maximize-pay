const apiBase = "https://classic-maximize-pay.onrender.com/api";

// Back Button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Elements
const connectBankBtn = document.getElementById("connectBankBtn");
const bankForm = document.getElementById("bankForm");
const savedDetailsDiv = document.getElementById("savedDetails");
const savedMethod = document.getElementById("savedMethod");
const savedAccount = document.getElementById("savedAccount");
const savedName = document.getElementById("savedName");
const editBankBtn = document.getElementById("editBankBtn");
const withdrawSection = document.getElementById("withdrawSection");
const withdrawBtn = document.getElementById("withdrawBtn");
const popup = document.getElementById("popup");

// Load User Info
const user = JSON.parse(localStorage.getItem("user")) || {};
const userId = user._id;

// Load Saved Bank Info
function loadBankDetails() {
  const saved = JSON.parse(localStorage.getItem("bankDetails"));
  if (saved) {
    savedMethod.textContent = saved.method;
    savedAccount.textContent = saved.account;
    savedName.textContent = saved.name;

    savedDetailsDiv.style.display = "block";
    bankForm.style.display = "none";
    withdrawSection.style.display = "block";
  } else {
    savedDetailsDiv.style.display = "none";
    withdrawSection.style.display = "none";
  }
}

// Show Bank Form
connectBankBtn.addEventListener("click", () => {
  bankForm.style.display = "block";
  savedDetailsDiv.style.display = "none";
});

// Save Bank Details
bankForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const method = document.getElementById("paymentMethod").value;
  const account = document.getElementById("accountNumber").value;
  const name = document.getElementById("fullName").value;

  if (!method || !account || !name) {
    showPopup("Please fill all fields", "error");
    return;
  }

  const bankDetails = { method, account, name };
  localStorage.setItem("bankDetails", JSON.stringify(bankDetails));
  loadBankDetails();
  showPopup("Bank details saved successfully!", "success");
});

// Edit Bank Details
editBankBtn.addEventListener("click", () => {
  bankForm.style.display = "block";
  savedDetailsDiv.style.display = "none";
  withdrawSection.style.display = "none";
});

// Withdraw Money
withdrawBtn.addEventListener("click", async () => {
  const amount = parseInt(document.getElementById("withdrawAmount").value);

  if (isNaN(amount) || amount < 12000) {
    showPopup("Minimum withdraw is 12,000 TZS", "error");
    return;
  }

  try {
    const res = await fetch(`${apiBase}/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "withdraw",
        userId,
        amount,
        transactionId: `WD-${Date.now()}`
      }),
    });

    const data = await res.json();
    if (res.ok) {
      // Update balance locally
      user.balance -= amount;
      localStorage.setItem("user", JSON.stringify(user));

      showPopup("Withdraw request submitted! Wait 1s - 24hrs.", "success");
    } else {
      showPopup(data.msg || "Withdraw failed!", "error");
    }
  } catch (error) {
    showPopup("Network error!", "error");
  }
});

// Popup Notifications
function showPopup(message, type) {
  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.style.display = "block";
  setTimeout(() => (popup.style.display = "none"), 3000);
}

// Initial Load
loadBankDetails();