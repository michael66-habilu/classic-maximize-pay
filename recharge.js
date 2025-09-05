// ===== Payment Method Selection =====
const payMethod = document.getElementById("paymentMethod");
const payInfo = document.getElementById("payInfo");
const payNumber = document.getElementById("payNumber");
const paySummary = document.getElementById("paySummary");
const productsSection = document.getElementById("productsSection");

const paymentNumbers = {
  "M-PESA": "0712345678",
  "MIXX BY YAS": "0761841886",
  "AIRTEL MONEY": "0680055125",
  "HALOPESA": "0751122334",
  "CRDB": "0654433221",
  "NMB": "0677788990",
  "SELCOM PAY": "0761122334"
};

payMethod.addEventListener("change", () => {
  if (payMethod.value) {
    payInfo.style.display = "block";
    const userName = document.getElementById("fullName").value || "User";
    payNumber.textContent = paymentNumbers[payMethod.value] || "";
    paySummary.textContent = `${payMethod.value}\nName: ${userName}\nNumber: ${payNumber.textContent}`;
  } else {
    payInfo.style.display = "none";
  }
});

// Copy payment number
function copyPayNumber() {
  const number = payNumber.textContent;
  if (number) {
    navigator.clipboard.writeText(number);
    alert("Payment number copied!");
  }
}

// Show products after payment info
document.getElementById("payBtn").addEventListener("click", () => {
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  if (!name || !phone || !payMethod.value) {
    alert("Please complete all fields.");
    return;
  }
  productsSection.style.display = "grid";
});

// ===== Purchase Popup =====
let selectedProduct = "";

function openPurchasePopup(productName) {
  selectedProduct = productName;
  document.getElementById("purchasePopup").style.display = "flex";
}

function closePurchasePopup() {
  document.getElementById("purchasePopup").style.display = "none";
}

// ===== Submit Recharge / API Call =====
async function submitRecharge() {
  const userId = localStorage.getItem("userId");
  const amount = parseFloat(document.getElementById("amount").value);
  const transactionId = document.getElementById("transactionId").value;

  if (!amount || !transactionId) {
    alert("Please enter amount and transaction ID.");
    return;
  }

  try {
    const res = await fetch("https://your-render-app.onrender.com/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "recharge",
        userId,
        amount,
        transactionId,
        product: selectedProduct,
        paymentMethod: payMethod.value
      })
    });

    const data = await res.json();
    alert(data.msg);
    if (data.success) {
      closePurchasePopup();
      document.getElementById("amount").value = "";
      document.getElementById("transactionId").value = "";
      selectedProduct = "";
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting recharge. Try again.");
  }
}