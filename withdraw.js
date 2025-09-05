const withdrawBtn = document.getElementById("withdrawBtn");
const bankPopup = document.getElementById("bankPopup");
const saveBankBtn = document.getElementById("saveBank");
const editBtn = document.getElementById("editInfo");

// Show popup
withdrawBtn.addEventListener("click", ()=>{
  alert("Connect your bank account.");
  bankPopup.style.display = "flex";
});

// Close popup
function closeBankPopup(){
  bankPopup.style.display = "none";
}

// Save info & submit withdraw
saveBankBtn.addEventListener("click", async ()=>{
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const bank = document.getElementById("bankName").value;
  const amount = parseFloat(document.getElementById("withdrawAmount").value);

  if(!name || !phone || !bank || !amount){
    alert("Please fill in all fields and enter a valid amount.");
    return;
  }

  try{
    const userId = localStorage.getItem("userId"); // Assumes userId is stored on login
    const res = await fetch("https://your-render-app.onrender.com/api/request", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "withdraw",
        userId,
        amount,
        bankName: bank,
        fullName: name,
        phone
      })
    });

    const data = await res.json();
    if(data.success){
      alert("✅ Withdraw request submitted. Wait for admin approval.");
      editBtn.style.display = "block";
      closeBankPopup();
      document.getElementById("withdrawAmount").value = ""; // reset amount
    } else {
      alert("Error: " + data.msg);
    }
  }catch(err){
    console.error(err);
    alert("Error submitting withdraw request.");
  }
});

// Edit / view info
editBtn.addEventListener("click", async ()=>{
  try{
    const userId = localStorage.getItem("userId");
    const res = await fetch(`https://your-render-app.onrender.com/api/user/${userId}`);
    const data = await res.json();
    if(data.success && data.user){
      document.getElementById("fullName").value = data.user.fullName || "";
      document.getElementById("phone").value = data.user.phone || "";
      document.getElementById("bankName").value = data.user.bankName || "";
      bankPopup.style.display = "flex";
    }
  }catch(err){
    console.error(err);
    alert("Error fetching user info.");
  }
});

// Back button
function goBack(){
  window.history.back();
}