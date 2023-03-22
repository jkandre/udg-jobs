const logoutForm = document.getElementById("logoutForm");

logoutForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	sessionStorage.clear();

	window.location.href = "http://127.0.0.1:5500/index.html";
});