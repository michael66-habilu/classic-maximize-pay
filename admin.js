// admin.js
const API_BASE = "https://classic-maximize-pay-e8ta.onrender.com/api/admin"; // <-- change if needed
const adminToken = localStorage.getItem("adminToken"); // token stored after admin login

// UI refs
const pendingRequestsDiv = document.getElementById("pendingRequests");
const usersPanel = document.getElementById("usersPanel");
const usersTableBody = document.getElementById("usersTableBody");
const rechargePanel = document.getElementById("rechargePanel");
const withdrawPanel = document.getElementById("withdrawPanel");
const tasksPanel = document.getElementById("tasksPanel");
const notifyPanel = document.getElementById("notifyPanel");

const investedMoneyEl = document.getElementById("investedMoney");
const withdrawnMoneyEl = document.getElementById("withdrawnMoney");
const remainingMoneyEl = document.getElementById("remainingMoney");
const quickStatsEl = document.getElementById("quickStats");

// menu buttons
document.getElementById("btnUsers").addEventListener("click", ()=>showPanel("users"));
document.getElementById("btnWithdraws").addEventListener("click", ()=>showPanel("withdraws"));
document.getElementById("btnRecharges").addEventListener("click", ()=>showPanel("recharges"));
document.getElementById("btnTasks").addEventListener("click", ()=>showPanel("tasks"));
document.getElementById("btnNotifications").addEventListener("click", ()=>showPanel("notify"));
document.getElementById("logoutAdminBtn").addEventListener("click", ()=>{
  localStorage.removeItem("adminToken");
  window.location.href = "adminLogin.html";
});

// show/hide panels
function showPanel(name){
  // hide all
  document.getElementById("pendingRequestsPanel").style.display = "none";
  usersPanel.style.display = "none";
  rechargePanel.style.display = "none";
  withdrawPanel.style.display = "none";
  tasksPanel.style.display = "none";
  notifyPanel.style.display = "none";

  if(name === "users"){ usersPanel.style.display = "block"; loadUsers(); }
  else if(name === "withdraws"){ withdrawPanel.style.display = "block"; loadWithdrawRequests(); }
  else if(name === "recharges"){ rechargePanel.style.display = "block"; loadRechargeRequests(); }
  else if(name === "tasks"){ tasksPanel.style.display = "block"; loadTasks(); }
  else if(name === "notify"){ notifyPanel.style.display = "block"; loadNotifications(); }
  else { document.getElementById("pendingRequestsPanel").style.display = "block"; loadPendingRequests(); }
}

// Helper for requests with admin auth header
function adminFetch(path, opts = {}){
  const headers = opts.headers || {};
  if(adminToken) headers["Authorization"] = `Bearer ${adminToken}`;
  opts.headers = headers;
  return fetch(API_BASE + path, opts);
}

// Load pending requests (both recharge & withdraw)
async function loadPendingRequests(){
  pendingRequestsDiv.innerHTML = "<p>Loading...</p>";
  try{
    const res = await adminFetch("/api/requests"); // GET all requests (backend snippet provided below)
    const data = await res.json();
    if(!Array.isArray(data) || data.length===0){
      pendingRequestsDiv.innerHTML = "<p>No pending requests.</p>";
      return;
    }
    pendingRequestsDiv.innerHTML = "";
    data.forEach(r=>{
      const div = document.createElement("div");
      div.className = "request";
      div.innerHTML = `
        <div><b>${r.type.toUpperCase()}</b> • ${r.amount || 0} TZS • <span class="muted">${new Date(r.createdAt).toLocaleString()}</span></div>
        <div class="small">User: ${r.userId} • Txn: ${r.transactionId || 'N/A'}</div>
        <div style="margin-top:6px;">
          <button class="btn-small btn-approve" onclick="approve('${r._id}')">Approve</button>
          <button class="btn-small btn-reject" onclick="rejectReq('${r._id}')">Reject</button>
          <button class="btn-small btn-delete" onclick="deleteReq('${r._id}')">Delete</button>
        </div>
      `;
      pendingRequestsDiv.appendChild(div);
    });
    updateQuickStats(data);
  }catch(err){
    console.error(err);
    pendingRequestsDiv.innerHTML = "<p style='color:salmon;'>Error loading requests</p>";
  }
}

// Approve / Reject / Delete
async function approve(id){
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/admin/request/approve", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ requestId:id })
    });
    const data = await res.json();
    alert(data.msg);
    loadPendingRequests();
  }catch(err){ console.error(err); alert("Error approving"); }
}
async function rejectReq(id){
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/admin/request/reject", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ requestId:id })
    });
    const data = await res.json();
    alert(data.msg);
    loadPendingRequests();
  }catch(err){ console.error(err); alert("Error rejecting"); }
}
async function deleteReq(id){
  try{
    const res = await adminFetch(`https://classic-maximize-pay-e8ta.onrender.com/api/requests/${id}`, { method:"DELETE" });
    const data = await res.json();
    alert(data.msg || "Deleted");
    loadPendingRequests();
  }catch(err){ console.error(err); alert("Error deleting"); }
}

// Load users
async function loadUsers(){
  usersTableBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/admin/users");
    const list = await res.json();
    usersTableBody.innerHTML = "";
    list.forEach(u=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${u.username}</td><td>${u.phone || ''}</td><td>TZS ${ (u.balance||0).toLocaleString() }</td>
        <td><button onclick="viewUser('${u._id}')">View</button></td>`;
      usersTableBody.appendChild(tr);
    });
  }catch(err){
    console.error(err);
    usersTableBody.innerHTML = "<tr><td colspan='4' style='color:salmon;'>Error loading users</td></tr>";
  }
}

// view single user (basic)
async function viewUser(id){
  try{
    const res = await adminFetch(`https://classic-maximize-pay-e8ta.onrender.com/api/user/${id}`);
    const u = await res.json();
    alert(`User: ${u.username}\nFull name: ${u.fullName}\nEmail: ${u.email}\nBalance: TZS ${u.balance}`);
  }catch(err){ console.error(err); alert("Error fetching user"); }
}

// Recharge requests list
async function loadRechargeRequests(){
  const el = document.getElementById("rechargeRequests");
  el.innerHTML = "<p>Loading...</p>";
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/requests?type=recharge");
    const arr = await res.json();
    if(!arr.length){ el.innerHTML="<p>No recharge requests</p>"; return; }
    el.innerHTML = "";
    arr.forEach(r=>{
      const d = document.createElement("div");
      d.className="request";
      d.innerHTML = `<div>${r.amount} TZS • ${new Date(r.createdAt).toLocaleString()}</div>
        <div><button class="btn-small btn-approve" onclick="approve('${r._id}')">Approve</button>
        <button class="btn-small btn-reject" onclick="rejectReq('${r._id}')">Reject</button></div>`;
      el.appendChild(d);
    });
  }catch(err){ console.error(err); el.innerHTML="<p style='color:salmon;'>Error</p>"; }
}

// Withdraw requests list
async function loadWithdrawRequests(){
  const el = document.getElementById("withdrawRequests");
  el.innerHTML = "<p>Loading...</p>";
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/requests?type=withdraw");
    const arr = await res.json();
    if(!arr.length){ el.innerHTML="<p>No withdraw requests</p>"; return; }
    el.innerHTML = "";
    arr.forEach(r=>{
      const d = document.createElement("div");
      d.className="request";
      d.innerHTML = `<div>${r.amount} TZS • ${new Date(r.createdAt).toLocaleString()}</div>
        <div>User: ${r.userId}</div>
        <div><button class="btn-small btn-approve" onclick="approve('${r._id}')">Approve</button>
        <button class="btn-small btn-reject" onclick="rejectReq('${r._id}')">Reject</button></div>`;
      el.appendChild(d);
    });
  }catch(err){ console.error(err); el.innerHTML="<p style='color:salmon;'>Error</p>"; }
}

// Tasks (simple storage via API)
document.getElementById("saveTaskBtn").addEventListener("click", async ()=>{
  const text = document.getElementById("taskText").value.trim();
  if(!text) return alert("Enter a task");
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/admin/task", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ text })
    });
    const d = await res.json();
    alert(d.msg);
    loadTasks();
  }catch(err){ console.error(err); alert("Error saving task"); }
});

async function loadTasks(){
  const el = document.getElementById("tasksList");
  el.innerHTML = "<p>Loading...</p>";
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/admin/tasks");
    const arr = await res.json();
    el.innerHTML = arr.map(t=>`<div class="small">${new Date(t.createdAt).toLocaleString()} - ${t.text}</div>`).join("");
  }catch(err){ console.error(err); el.innerHTML="<p style='color:salmon;'>Error'</p>"; }
}

// Notifications
document.getElementById("saveNotifyBtn").addEventListener("click", async ()=>{
  const date = document.getElementById("notifyDate").value;
  const text = document.getElementById("notifyText").value.trim();
  if(!date || !text) return alert("Enter date and text");
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/admin/notification", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ date, content:text })
    });
    const d = await res.json();
    alert(d.msg);
    loadNotifications();
  }catch(err){ console.error(err); alert("Error saving notification"); }
});

async function loadNotifications(){
  const el = document.getElementById("notificationsList");
  el.innerHTML = "<p>Loading...</p>";
  try{
    const res = await adminFetch("https://classic-maximize-pay-e8ta.onrender.com/api/admin/notification");
    const arr = await res.json();
    el.innerHTML = arr.map(n=>`<div class="small">${n.date} — ${n.content}</div>`).join("");
  }catch(err){ console.error(err); el.innerHTML="<p style='color:salmon;'>Error'</p>"; }
}

// Quick stats update
function updateQuickStats(requests){
  const invested = requests.filter(r=>r.type==="recharge").reduce((s,r)=>s+(r.amount||0),0);
  const withdrawn = requests.filter(r=>r.type==="withdraw" && r.status==="Approved").reduce((s,r)=>s+(r.amount||0),0);
  investedMoneyEl.textContent = `TZS ${invested.toLocaleString()}`;
  withdrawnMoneyEl.textContent = `TZS ${withdrawn.toLocaleString()}`;
  remainingMoneyEl.textContent = `TZS ${ (invested - withdrawn).toLocaleString() }`;
  quickStatsEl.innerHTML = `<div class="small">Requests: ${requests.length}</div>`;
}

// initial view
showPanel(); // default pending requests