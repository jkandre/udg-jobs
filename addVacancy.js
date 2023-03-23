import { getVacancyID, saveVacancy } from "./firebase.js";

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

const username = document.getElementById("username");
username.innerHTML =
	"Bienvenido: " + JSON.parse(sessionStorage.getItem("session")).companyName;

const registerVancancyForm = document.getElementById("registerVancancyForm");

registerVancancyForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const tittle = registerVancancyForm["vacante"];
	const payment = registerVancancyForm["sueldo"];
	const time = registerVancancyForm["jornadaRadio"];
	const description = registerVancancyForm["descripcion"];

	const querySnapshotID = await getVacancyID();
	if (!querySnapshotID.docs.length > 0) {
		alert("Ocurrrio un error al agregar la vacante, contacte con el administrador");
		return false;
	}
	
	await saveVacancy(
		tittle.value,
		payment.value,
		time.value,
		description.value,
		parseInt(querySnapshotID.docs[0].data().idVacancy) + 1,
		parseInt(JSON.parse(sessionStorage.getItem("session")).idCompany)
	);

	setTimeout( function() { window.location.href = "empresaHome.html"; }, 300 );
});
