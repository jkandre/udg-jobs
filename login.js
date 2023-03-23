import { login, loginCompany } from "./firebase.js";

if (sessionStorage.getItem("session") != null) {
	if (
		JSON.parse(sessionStorage.getItem("session")).username != "" &&
		JSON.parse(sessionStorage.getItem("session")).username != null
	) {
		window.location.href = "perfil.html";
	}

	if (
		JSON.parse(sessionStorage.getItem("session")).idCompany != "" &&
		JSON.parse(sessionStorage.getItem("session")).idCompany != null
	) {
		window.location.href = "empresaHome.html";
	}
}

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async (e) => {
	e.preventDefault();

	const pass = formLogin["pass"];
	const mail = formLogin["mail"];

	const querySnapshot = await login(mail.value, pass.value);
	const querySnapshotCompany = await loginCompany(mail.value, pass.value);

	if (!(querySnapshot.docs.length > 0)) {
		if (!(querySnapshotCompany.docs.length > 0)) {
			alert("No se encontraron las credenciales, intentalo de nuevo");
			return false;
		}
	}

	if (querySnapshot.docs.length > 0) {
		sessionStorage.setItem(
			"session",
			JSON.stringify({
				username: querySnapshot.docs[0].data().username,
				name: querySnapshot.docs[0].data().name,
				lastname: querySnapshot.docs[0].data().lastname,
				mail: querySnapshot.docs[0].data().mail
			})
		);

		setTimeout(function () {
			window.location.href = "perfil.html";
		}, 300);
	} else if (querySnapshotCompany.docs.length > 0) {
		sessionStorage.setItem(
			"session",
			JSON.stringify({
				companyName: querySnapshotCompany.docs[0].data().companyName,
				mail: querySnapshotCompany.docs[0].data().mail,
				adress: querySnapshotCompany.docs[0].data().adress,
				idCompany: querySnapshotCompany.docs[0].data().idCompany
			})
		);

		setTimeout(function () {
			window.location.href = "empresaHome.html";
		}, 300);
	}

});
