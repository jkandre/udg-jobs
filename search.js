import {
	getVacants,
	validateApplication,
	saveApplication,
	getVacantsSalary,
	getUserInfo,
	getUserKnowledge,
	getProfessionsTopics,
	getVacantWeights
} from "./firebase.js";

if (sessionStorage.getItem("session") != null) {
	if (
		JSON.parse(sessionStorage.getItem("session")).username == "" ||
		JSON.parse(sessionStorage.getItem("session")).username == null
	) {
		window.location.href = "index.html";
	}
} else {
	window.location.href = "index.html";
}

const welcome_user = document.getElementById("welcome_user");
// welcome_user.innerHTML = "Bienvenido: " + JSON.parse(sessionStorage.getItem("session")).username;

const searchForm = document.getElementById("searchForm");

const children = document.getElementById("vacancyDetail").children;

const applyVacancyBtn = document.getElementById("applyVacancyBtn");

const salarySearchBtn = document.getElementById("salarySearchBtn");
const algorithmSearchBtn = document.getElementById("algorithmSearchBtn");

let querySnapshot;
let selectedVacancy;

searchForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const vacanciesDiv = document.getElementById("vacanciesDiv");

	while (vacanciesDiv.firstChild) {
		vacanciesDiv.removeChild(vacanciesDiv.firstChild);
	}

	const searchVacancy = searchForm["busqueda"].value;

	querySnapshot.forEach((doc) => {
		if (doc.data().title.toLowerCase().indexOf(searchVacancy) > -1) {
			const a = document.createElement("a");
			a.classList.add("resultados_vacante");

			const divtitle = document.createElement("div");
			divtitle.classList.add("nombreFecha");

			const title = document.createElement("h3");
			title.innerHTML = doc.data().title;

			const company = document.createElement("p");
			company.classList.add("vacante_subtitulos");
			company.innerHTML = "Empresa " + doc.data().title;

			const payment = document.createElement("p");
			payment.classList.add("vacante_descripcion");
			payment.innerHTML = "$ " + doc.data().payment;

			const time = document.createElement("p");
			time.classList.add("vacante_descripcion");
			time.innerHTML = "Jornada: " + doc.data().time + " horas";

			const desc = document.createElement("p");
			desc.classList.add("vacante_descripcion");
			desc.innerHTML = "Descripcion: " + doc.data().description;

			const idVacancy = document.createElement("p");
			idVacancy.classList.add("id_vacancy");
			idVacancy.innerHTML = doc.data().idVacancy;

			vacanciesDiv.appendChild(a);
			a.appendChild(divtitle);
			divtitle.appendChild(title);
			a.appendChild(idVacancy);
			// a.appendChild(company);
			a.appendChild(payment);
			a.appendChild(time);
			a.appendChild(desc);
		}
	});

	let childrenSearch = document.getElementById("vacanciesDiv").children;

	for (var i = 0; i < childrenSearch.length; i++) {
		childrenSearch[i].addEventListener(
			"click",
			(e) => {
				var elementSelected = document.getElementsByClassName("a_selected");

				for (var i = 0; i < elementSelected.length; i++) {
					elementSelected[i].classList.remove("a_selected");
				}

				e.currentTarget.classList.add("a_selected");

				let search = parseInt(
					e.currentTarget.querySelector(".id_vacancy").innerHTML
				);

				querySnapshot.forEach((doc) => {
					if (doc.data().idVacancy === search) {
						selectedVacancy = doc;

						children.item(0).innerHTML = selectedVacancy.data().title;
						children.item(2).innerHTML = "$" + selectedVacancy.data().payment;
						children.item(3).innerHTML =
							"Jornada: " + selectedVacancy.data().time;
						children.item(4).innerHTML =
							"Descripcion: " + selectedVacancy.data().description;
					}
				});
			},
			false
		);
	}
});

window.addEventListener("DOMContentLoaded", async () => {
	const vacanciesDiv = document.getElementById("vacanciesDiv");
	querySnapshot = await getVacants();

	for (let i = 0; i < querySnapshot.docs.length; i++) {
		const a = document.createElement("a");
		a.classList.add("resultados_vacante");

		const divtitle = document.createElement("div");
		divtitle.classList.add("nombreFecha");

		const title = document.createElement("h3");
		title.innerHTML = querySnapshot.docs[i].data().title;

		const company = document.createElement("p");
		company.classList.add("vacante_subtitulos");
		company.innerHTML = "Empresa " + querySnapshot.docs[i].data().title;

		const payment = document.createElement("p");
		payment.classList.add("vacante_descripcion");
		payment.innerHTML = "$ " + querySnapshot.docs[i].data().payment;

		const time = document.createElement("p");
		time.classList.add("vacante_descripcion");
		time.innerHTML = "Jornada: " + querySnapshot.docs[i].data().time + " horas";

		const desc = document.createElement("p");
		desc.classList.add("vacante_descripcion");
		desc.innerHTML = "Descripcion: " + querySnapshot.docs[i].data().description;

		const idVacancy = document.createElement("p");
		idVacancy.classList.add("id_vacancy");
		idVacancy.innerHTML = querySnapshot.docs[i].data().idVacancy;

		vacanciesDiv.appendChild(a);
		a.appendChild(divtitle);
		divtitle.appendChild(title);
		a.appendChild(idVacancy);
		// a.appendChild(company);
		a.appendChild(payment);
		a.appendChild(time);
		a.appendChild(desc);
	}

	if (querySnapshot.docs.length > 0) {
		selectedVacancy = querySnapshot.docs[0];

		children.item(0).innerHTML = selectedVacancy.data().title;
		children.item(2).children.item(1).innerHTML =
			"$" + selectedVacancy.data().payment;
		children.item(3).children.item(1).innerHTML = selectedVacancy.data().time;
		children.item(4).children.item(1).innerHTML =
			selectedVacancy.data().description;

		document
			.querySelector("#vacanciesDiv :nth-child(1)")
			.classList.add("a_selected");
	}

	var elements = document.getElementsByClassName("resultados_vacante");

	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener(
			"click",
			(e) => {
				var elementSelected = document.getElementsByClassName("a_selected");

				for (var i = 0; i < elementSelected.length; i++) {
					elementSelected[i].classList.remove("a_selected");
				}

				e.currentTarget.classList.add("a_selected");

				let search = parseInt(
					e.currentTarget.querySelector(".id_vacancy").innerHTML
				);

				querySnapshot.forEach((doc) => {
					if (doc.data().idVacancy === search) {
						selectedVacancy = doc;

						children.item(0).innerHTML = selectedVacancy.data().title;
						children.item(2).children.item(1).innerHTML =
							"$" + selectedVacancy.data().payment;
						children.item(3).children.item(1).innerHTML =
							selectedVacancy.data().time;
						children.item(4).children.item(1).innerHTML =
							selectedVacancy.data().description;
					}
				});
			},
			false
		);
	}
});

applyVacancyBtn.addEventListener("click", async (e) => {
	e.preventDefault();

	const querySnapshotApplication = await validateApplication(
		JSON.parse(sessionStorage.getItem("session")).username,
		parseInt(selectedVacancy.data().idVacancy)
	);
	if (querySnapshotApplication.docs.length > 0) {
		alert("Ya aplicaste anteriormente a este empleo");
		return false;
	}

	await saveApplication(
		JSON.parse(sessionStorage.getItem("session")).username,
		parseInt(selectedVacancy.data().idVacancy)
	);
});

salarySearchBtn.addEventListener("click", async (e) => {
	e.preventDefault();

	const vacanciesDiv = document.getElementById("vacanciesDiv");

	while (vacanciesDiv.firstChild) {
		vacanciesDiv.removeChild(vacanciesDiv.firstChild);
	}

	querySnapshot = await getVacantsSalary();

	for (let i = 0; i < querySnapshot.docs.length; i++) {
		const a = document.createElement("a");
		a.classList.add("resultados_vacante");

		const divtitle = document.createElement("div");
		divtitle.classList.add("nombreFecha");

		const title = document.createElement("h3");
		title.innerHTML = querySnapshot.docs[i].data().title;

		const company = document.createElement("p");
		company.classList.add("vacante_subtitulos");
		company.innerHTML = "Empresa " + querySnapshot.docs[i].data().title;

		const payment = document.createElement("p");
		payment.classList.add("vacante_descripcion");
		payment.innerHTML = "$ " + querySnapshot.docs[i].data().payment;

		const time = document.createElement("p");
		time.classList.add("vacante_descripcion");
		time.innerHTML = "Jornada: " + querySnapshot.docs[i].data().time + " horas";

		const desc = document.createElement("p");
		desc.classList.add("vacante_descripcion");
		desc.innerHTML = "Descripcion: " + querySnapshot.docs[i].data().description;

		const idVacancy = document.createElement("p");
		idVacancy.classList.add("id_vacancy");
		idVacancy.innerHTML = querySnapshot.docs[i].data().idVacancy;

		vacanciesDiv.appendChild(a);
		a.appendChild(divtitle);
		divtitle.appendChild(title);
		a.appendChild(idVacancy);
		// a.appendChild(company);
		a.appendChild(payment);
		a.appendChild(time);
		a.appendChild(desc);
	}

	if (querySnapshot.docs.length > 0) {
		selectedVacancy = querySnapshot.docs[0];

		children.item(0).innerHTML = selectedVacancy.data().title;
		children.item(2).innerHTML = "$" + selectedVacancy.data().payment;
		children.item(3).innerHTML = "Jornada: " + selectedVacancy.data().time;
		children.item(4).innerHTML =
			"Descripcion: " + selectedVacancy.data().description;

		document
			.querySelector("#vacanciesDiv :nth-child(1)")
			.classList.add("a_selected");
	}

	var elements = document.getElementsByClassName("resultados_vacante");

	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener(
			"click",
			(e) => {
				var elementSelected = document.getElementsByClassName("a_selected");

				for (var i = 0; i < elementSelected.length; i++) {
					elementSelected[i].classList.remove("a_selected");
				}

				e.currentTarget.classList.add("a_selected");

				let search = parseInt(
					e.currentTarget.querySelector(".id_vacancy").innerHTML
				);

				querySnapshot.forEach((doc) => {
					if (doc.data().idVacancy === search) {
						selectedVacancy = doc;

						children.item(0).innerHTML = selectedVacancy.data().title;
						children.item(2).innerHTML = "$" + selectedVacancy.data().payment;
						children.item(3).innerHTML =
							"Jornada: " + selectedVacancy.data().time;
						children.item(4).innerHTML =
							"Descripcion: " + selectedVacancy.data().description;
					}
				});
			},
			false
		);
	}
});

algorithmSearchBtn.addEventListener("click", async (e) => {
	e.preventDefault();

	const vacanciesDiv = document.getElementById("vacanciesDiv");

	while (vacanciesDiv.firstChild) {
		vacanciesDiv.removeChild(vacanciesDiv.firstChild);
	}

	//Solo obtener las que son de la profesion del user
	let username = JSON.parse(sessionStorage.getItem("session")).username;

	let querySnapshotProfessionID = await getUserInfo(username);

	if (!querySnapshotProfessionID.docs.length > 0) {
		alert(
			"Ocurrrio un error al obtener la profesion del usuario, contacte con el administrador"
		);
		return false;
	}

	let querySnapshotUserKnowledge = await getUserKnowledge(
		JSON.parse(sessionStorage.getItem("session")).username
	);
	let topicsProfession = await getProfessionsTopics(querySnapshotProfessionID.docs[0].data().userProfession);

	let firstOccurs = false;

	for (let i = 0; i < querySnapshot.docs.length; i++) {
		if (
			querySnapshot.docs[i].data().idProfession ===
			querySnapshotProfessionID.docs[0].data().userProfession
		) {
			let querySnapshotWeightsVacant = await getVacantWeights(parseInt(querySnapshot.docs[i].data().idVacancy));
			
			let arrayWeightsNeeded = [];
			let topicsUser = [];

			querySnapshotWeightsVacant.forEach(topicNeeded => {
				arrayWeightsNeeded.push({
					"idTopic": topicNeeded.data().idTopic,
					"rateNeeded": topicNeeded.data().rateNeeded
				})
				topicsUser.push(topicNeeded.data().idTopic);
			});

			if(!(querySnapshotWeightsVacant.docs.length >= topicsProfession.docs.length)){
				topicsProfession.forEach(topicProfessionDoc => {
					if(!topicsUser.includes(topicProfessionDoc.data().idTopic)){
						arrayWeightsNeeded.push({
							"idTopic": topicProfessionDoc.data().idTopic,
							"rateNeeded": 0
						})
					}
				});
			}

			//Implementar un modelo
			
			const a = document.createElement("a");
			a.classList.add("resultados_vacante");

			const divtitle = document.createElement("div");
			divtitle.classList.add("nombreFecha");

			const title = document.createElement("h3");
			title.innerHTML = querySnapshot.docs[i].data().title;

			const company = document.createElement("p");
			company.classList.add("vacante_subtitulos");
			company.innerHTML = "Empresa " + querySnapshot.docs[i].data().title;

			const payment = document.createElement("p");
			payment.classList.add("vacante_descripcion");
			payment.innerHTML = "$ " + querySnapshot.docs[i].data().payment;

			const time = document.createElement("p");
			time.classList.add("vacante_descripcion");
			time.innerHTML =
				"Jornada: " + querySnapshot.docs[i].data().time + " horas";

			const desc = document.createElement("p");
			desc.classList.add("vacante_descripcion");
			desc.innerHTML =
				"Descripcion: " + querySnapshot.docs[i].data().description;

			const idVacancy = document.createElement("p");
			idVacancy.classList.add("id_vacancy");
			idVacancy.innerHTML = querySnapshot.docs[i].data().idVacancy;

			vacanciesDiv.appendChild(a);
			a.appendChild(divtitle);
			divtitle.appendChild(title);
			a.appendChild(idVacancy);
			// a.appendChild(company);
			a.appendChild(payment);
			a.appendChild(time);
			a.appendChild(desc);


			if (!firstOccurs) {
				firstOccurs = true;
				selectedVacancy = querySnapshot.docs[i];

				children.item(0).innerHTML = selectedVacancy.data().title;
				children.item(2).innerHTML = "$" + selectedVacancy.data().payment;
				children.item(3).innerHTML = "Jornada: " + selectedVacancy.data().time;
				children.item(4).innerHTML =
					"Descripcion: " + selectedVacancy.data().description;

				document
					.querySelector("#vacanciesDiv :nth-child(1)")
					.classList.add("a_selected");
			}
		}
	}

	if (querySnapshot.docs.length > 0 && !firstOccurs) {
		selectedVacancy = querySnapshot.docs[0];

		children.item(0).innerHTML = selectedVacancy.data().title;
		children.item(2).innerHTML = "$" + selectedVacancy.data().payment;
		children.item(3).innerHTML = "Jornada: " + selectedVacancy.data().time;
		children.item(4).innerHTML =
			"Descripcion: " + selectedVacancy.data().description;

		document
			.querySelector("#vacanciesDiv :nth-child(1)")
			.classList.add("a_selected");
	}

	var elements = document.getElementsByClassName("resultados_vacante");

	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener(
			"click",
			(e) => {
				var elementSelected = document.getElementsByClassName("a_selected");

				for (var i = 0; i < elementSelected.length; i++) {
					elementSelected[i].classList.remove("a_selected");
				}

				e.currentTarget.classList.add("a_selected");

				let search = parseInt(
					e.currentTarget.querySelector(".id_vacancy").innerHTML
				);

				querySnapshot.forEach((doc) => {
					if (doc.data().idVacancy === search) {
						selectedVacancy = doc;

						children.item(0).innerHTML = selectedVacancy.data().title;
						children.item(2).innerHTML = "$" + selectedVacancy.data().payment;
						children.item(3).innerHTML =
							"Jornada: " + selectedVacancy.data().time;
						children.item(4).innerHTML =
							"Descripcion: " + selectedVacancy.data().description;
					}
				});
			},
			false
		);
	}
});
