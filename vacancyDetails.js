import { getVacancyDetails } from "./firebase.js";

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

let querySnapshotVacancyDetail;

window.addEventListener("DOMContentLoaded", async () => {
	querySnapshotVacancyDetail = await getVacancyDetails(parseInt(new URLSearchParams(window.location.search).get('id')));

	if (!querySnapshotVacancyDetail.docs.length > 0){

	}
	
	const vacanciesDiv = document.getElementById("vacancyDetails");

	//p con el id de la vacante
	const idVacancy = document.createElement("p");
	idVacancy.classList.add("id_vacancy");
	idVacancy.innerHTML = querySnapshotVacancyDetail.docs[0].data().idVacancy;
	//titulo de la vacante
	const title = document.createElement("h2");
	title.classList.add("vacanteTitulo");
	title.innerHTML = querySnapshotVacancyDetail.docs[0].data().title;

	//Div pair payment
	const divPair = document.createElement("div");
	divPair.classList.add("pair");
	const bold = document.createElement("bold");
	bold.innerHTML = "Salario: "
	const payment = document.createElement("p");
	// payment.classList.add("vacante_descripcion");
	payment.innerHTML = "$ " + querySnapshotVacancyDetail.docs[0].data().payment;
	divPair.appendChild(bold);
	divPair.appendChild(payment);
	

	//Div pair time
	const divPairTime = document.createElement("div");
	divPairTime.classList.add("pair");
	const boldTime = document.createElement("bold");
	boldTime.innerHTML = "Jornada: "
	const time = document.createElement("p");
	// time.classList.add("vacante_descripcion");
	time.innerHTML = querySnapshotVacancyDetail.docs[0].data().time + " horas";
	divPairTime.appendChild(boldTime);
	divPairTime.appendChild(time);
	
	//Descripcion
	const boldDesc = document.createElement("bold");
	boldDesc.innerHTML = "Descripcion: "
	const desc = document.createElement("p");
	desc.classList.add("vacante_descripcion");
	desc.innerHTML = querySnapshotVacancyDetail.docs[0].data().description;

	const btnEliminar = document.createElement("button");
	btnEliminar.classList.add("btnDeleteTopic");
	btnEliminar.innerHTML = "Deshabilitar";

	vacanciesDiv.appendChild(idVacancy);
	vacanciesDiv.appendChild(title);
	vacanciesDiv.appendChild(divPair);
	vacanciesDiv.appendChild(divPairTime);
	vacanciesDiv.appendChild(boldDesc);
	vacanciesDiv.appendChild(desc);
	vacanciesDiv.appendChild(btnEliminar);

});


