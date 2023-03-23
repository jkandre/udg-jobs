const logoutForm = document.getElementById("logoutForm");

logoutForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	sessionStorage.clear();

	window.location.href = "index.html";
});