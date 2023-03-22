import { getVacants } from "./firebase.js";

if (sessionStorage.getItem("session") != null) {
	if (
		JSON.parse(sessionStorage.getItem("session")).username == "" ||
		JSON.parse(sessionStorage.getItem("session")).username == null
	) {
		window.location.href = "http://127.0.0.1:5500/index.html";
	}
}

const welcome_user = document.getElementById("welcome_user");
welcome_user.innerHTML =
	"Bienvenido: " + JSON.parse(sessionStorage.getItem("session")).username;

const searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", async (e) => {
	e.preventDefault();
});

window.addEventListener("DOMContentLoaded", async () => {
	const vacanciesDiv = document.getElementById("vacanciesDiv");
	const querySnapshot = await getVacants();

	for (let i = 0; i < querySnapshot.docs.length; i++) {
		const a = document.createElement("a");
		a.classList.add("resultados_vacante");

		const divtitle = document.createElement("div");
		divtitle.classList.add("nombreFecha");

		const title = document.createElement("h3");
		title.innerHTML = querySnapshot.docs[i].data().title;

		const company = document.createElement("p");
		company.classList.add("vacante_subtitulos");
		company.innerHTML = "Empresa";

		const payment = document.createElement("p");
		payment.classList.add("vacante_descripcion");
		payment.innerHTML = "$ "+querySnapshot.docs[i].data().payment;

		const time = document.createElement("p");
		time.classList.add("vacante_descripcion");
		time.innerHTML = "Jornada: "+querySnapshot.docs[i].data().time+" horas";

		const desc = document.createElement("p");
		desc.classList.add("vacante_descripcion");
		desc.innerHTML = "Descripcion: "+querySnapshot.docs[i].data().description;

		vacanciesDiv.appendChild(a);
		a.appendChild(divtitle);
		divtitle.appendChild(title);
		a.appendChild(company);
		a.appendChild(payment);
		a.appendChild(time);
		a.appendChild(desc);
	}

	
});
