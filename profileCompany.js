import { getVacantsPublished, disableVacancy } from "./firebase.js";

if (sessionStorage.getItem("session") != null) {
	if (
		JSON.parse(sessionStorage.getItem("session")).idCompany == "" ||
		JSON.parse(sessionStorage.getItem("session")).idCompany == null
	) {
		window.location.href = "index.html";
	}
} else {
	window.location.href = "index.html";
}

const idCompany = parseInt(
	JSON.parse(sessionStorage.getItem("session")).idCompany
);

window.addEventListener("DOMContentLoaded", async () => {
	const vacanciesDiv = document.getElementById("vacanciesDiv");
	const querySnapshot = await getVacantsPublished(idCompany);

	for (let i = 0; i < querySnapshot.docs.length; i++) {
		const a = document.createElement("a");
		a.classList.add("vacante");

		const title = document.createElement("h3");
        title.classList.add("vacante_titulo");
		title.innerHTML = querySnapshot.docs[i].data().title;

		const payment = document.createElement("p");
		// payment.classList.add("vacante_descripcion");
		payment.innerHTML = "$ " + querySnapshot.docs[i].data().payment;

		const time = document.createElement("p");
		// time.classList.add("vacante_descripcion");
		time.innerHTML = "Jornada: " + querySnapshot.docs[i].data().time + " horas";

		const desc = document.createElement("p");
		desc.classList.add("vacante_descripcion");
		desc.innerHTML = "Descripcion: " + querySnapshot.docs[i].data().description;

		const btnEliminar = document.createElement("button");
		btnEliminar.classList.add("btnDeleteTopic");
		btnEliminar.innerHTML = "Eliminar";

		const idVacancy = document.createElement("p");
		idVacancy.classList.add("id_vacancy");
		idVacancy.innerHTML = querySnapshot.docs[i].data().idVacancy;

		vacanciesDiv.appendChild(a);
		a.appendChild(idVacancy);
		a.appendChild(title);
		a.appendChild(payment);
		a.appendChild(time);
		a.appendChild(desc);
		a.appendChild(btnEliminar);
	}

	var elements = document.getElementsByClassName("btnDeleteTopic");

	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener(
			"click",
			async (e) => {
				const parent = e.target.parentNode;

				await disableVacancy(parseInt(parent.firstChild.innerHTML));

				parent.remove();
			},
			false
		);
	}
});
