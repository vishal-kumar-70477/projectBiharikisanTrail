
  function safeCreateIcons(){
    if(window.lucide && typeof lucide.createIcons === 'function'){
      try{ lucide.createIcons(); } catch(err){}
    }
  }
  safeCreateIcons();
  document.getElementById('hamburgerBtn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

  const logoutBtn = document.getElementById("logoutBtn");
//logout
logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    console.log("Logout button clicked");

    try {
        const response = await fetch("/biharikisan/auth/logout", {
            method: "get",
            credentials: "include"
        });

        console.log("Status:", response.status);
        console.log("URL:", response.url);

        const text = await response.text();

        console.log("Backend response:", text);

        if (!text) {
            throw new Error("Backend ne empty response diya");
        }

        const data = JSON.parse(text);

        if (data.success) {
            window.location.href = "/";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("LOGOUT ERROR:", error);
        alert("Logout failed: " + error.message);
    }
}); 