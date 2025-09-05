const userId = localStorage.getItem("userId");
const investmentContainer = document.getElementById("investmentGrid");

// === Load Available Investment Plans ===
async function loadInvestmentPlans() {
  try {
    const res = await fetch("https://classic-maximize-pay.onrender.com/api/investment-plans");
    const plans = await res.json();
    investmentContainer.innerHTML = "";

    plans.forEach(plan => {
      const div = document.createElement("div");
      div.className = "plan-card";
      div.innerHTML = `
        <h3>${plan.name}</h3>
        <p>Min: ${plan.min} TZS</p>
        <p>Max: ${plan.max} TZS</p>
        <p>Daily Return: ${plan.dailyReturn}%</p>
        <button onclick="invest('${plan._id}')">Invest Now</button>
      `;
      investmentContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading investment plans:", error);
    investmentContainer.innerHTML = `<p style="color:red;">Error loading plans</p>`;
  }
}

// === Make an Investment ===
async function invest(planId) {
  const amount = prompt("Enter investment amount:");
  if (!amount || isNaN(amount)) {
    alert("Invalid amount");
    return;
  }

  try {
    const res = await fetch("https://classic-maximize-pay-e8ta.onrender.com/api/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, planId, amount })
    });
    const data = await res.json();
    alert(data.msg);
    loadInvestmentPlans();
  } catch (error) {
    console.error("Error making investment:", error);
    alert("Error making investment, try again.");
  }
}

// Initial load
loadInvestmentPlans();