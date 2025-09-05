const userId = localStorage.getItem("userId");
const container = document.getElementById("ordersContainer");

// === Fetch Purchased Orders ===
async function loadPurchasedOrders() {
  try {
    const res = await fetch(`https://classic-maximize-pay.onrender.com/api/user/${userId}`);
    const user = await res.json();
    container.innerHTML = "";

    if (!user.purchased || user.purchased.length === 0) {
      container.innerHTML = "<p>No purchased products yet.</p>";
      return;
    }

    user.purchased.forEach((item, idx) => {
      const div = document.createElement("div");
      div.className = "order";
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>Price: TZS ${item.price.toLocaleString()}</p>
        <p>Status: ${item.status}</p>
        <p>Transaction ID / Receipt:</p>
        <input class="task-input" type="text" id="trans${idx}" placeholder="Enter transaction ID / receipt" value="${item.transactionId || ''}">
        <button onclick="confirmPurchase('${item._id}', ${idx})">Confirm</button>
        <p id="notification${idx}" style="margin-top:6px; font-weight:700;"></p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading purchased orders:", error);
    container.innerHTML = `<p style="color:red;">Error loading data</p>`;
  }
}

// === Confirm Purchase ===
async function confirmPurchase(orderId, idx) {
  const input = document.getElementById("trans" + idx);
  if (input.value.trim() === "") {
    alert("Please enter transaction ID or receipt");
    return;
  }

  try {
    const res = await fetch(`https://classic-maximize-pay.onrender.com/api/purchase/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        orderId,
        transactionId: input.value.trim()
      })
    });

    const data = await res.json();
    alert(data.msg);
    loadPurchasedOrders();
  } catch (error) {
    console.error("Error confirming purchase:", error);
    alert("Error confirming purchase, try again.");
  }
}

// Initial load
loadPurchasedOrders();

function goBack() {
  window.history.back();
}