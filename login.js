const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async ()=>{
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if(!username || !password){
    alert("Please fill all fields.");
    return;
  }

  try{
    const res = await fetch("https://your-render-app.onrender.com/api/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if(data.success){
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    }else{
      alert(data.message);
    }
  }catch(err){
    console.error(err);
    alert("Server error. Try again later.");
  }
});