const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async ()=>{
  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if(!fullname || !username || !email || !phone || !password || !confirmPassword){
    alert("Please fill all fields.");
    return;
  }
  if(password !== confirmPassword){
    alert("Passwords do not match.");
    return;
  }

  try{
    const res = await fetch("https://your-render-app.onrender.com/api/register", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({fullname, username, email, phone, password})
    });
    const data = await res.json();
    if(data.success){
      alert("Registration successful!");
      window.location.href = "login.html";
    }else{
      alert(data.message);
    }
  }catch(err){
    console.error(err);
    alert("Server error. Try again later.");
  }
});