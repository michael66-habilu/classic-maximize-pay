const userId = localStorage.getItem("userId");
const username = localStorage.getItem("username");
const inviteLinkInput = document.getElementById("inviteLink");
const team1Count = document.getElementById("team1Count");
const team2Count = document.getElementById("team2Count");
const team3Count = document.getElementById("team3Count");
const usersList = document.getElementById("usersList");

// === Set Invitation Link ===
const inviteLink = `https://classic-maximize-pay.com/register?ref=${username}`;
inviteLinkInput.value = inviteLink;

// === Copy Link ===
function copyLink() {
  navigator.clipboard.writeText(inviteLinkInput.value);
  alert("Invitation link copied!");
}

// === Share Link ===
function shareLink(platform) {
  const url = encodeURIComponent(inviteLink);
  let shareURL = "";

  switch (platform) {
    case "whatsapp":
      shareURL = `https://wa.me/?text=${url}`;
      break;
    case "facebook":
      shareURL = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case "instagram":
      alert("Instagram sharing must be done manually.");
      return;
    case "tiktok":
      alert("TikTok sharing must be done manually.");
      return;
    case "telegram":
      shareURL = `https://t.me/share/url?url=${url}&text=Join%20Classic%20Maximize%20Pay!`;
      break;
  }
  window.open(shareURL, "_blank");
}

// === Fetch User Affiliate Data ===
async function loadAffiliateData() {
  try {
    const res = await fetch(`https://classic-maximize-pay.onrender.com/api/user/${userId}`);
    const data = await res.json();

    // Update team counts
    team1Count.textContent = data.team1.length;
    team2Count.textContent = data.team2.length;
    team3Count.textContent = data.team3.length;

    // Update user list
    usersList.innerHTML = "";
    if (data.team1.length === 0 && data.team2.length === 0 && data.team3.length === 0) {
      usersList.innerHTML = `<p>No users have joined via your link yet.</p>`;
      return;
    }

    const allUsers = [...data.team1, ...data.team2, ...data.team3];
    allUsers.forEach(user => {
      const div = document.createElement("div");
      div.classList.add("user-item");
      div.innerHTML = `
        <span>${user.username}</span>
        <span>${user.phone || "No phone"}</span>
      `;
      usersList.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching affiliate data:", error);
    usersList.innerHTML = `<p style="color:red;">Error loading affiliate data</p>`;
  }
}

loadAffiliateData();