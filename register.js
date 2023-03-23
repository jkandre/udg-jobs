import { saveUser, validateUser, validateMail } from "./firebase.js";

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

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const pass = registerForm["pass1"];
	let pass2 = registerForm["pass2"].value;
	if (pass.value != pass2) {
		alert("Las contraseñas no coinciden");
		return false;
	}

	const name = registerForm["nombre"];
	const lastname = registerForm["apellido"];
	const mail = registerForm["correo"];
	const username = registerForm["username"];

	const querySnapshot = await validateUser(username.value);
	if (querySnapshot.docs.length > 0) {
		alert("El username ya esta registrado, intentalo de nuevo");
		return false;
	}

	const querySnapshotMail = await validateMail(mail.value);
	if (querySnapshotMail.docs.length > 0) {
		alert("El mail ya esta registrado, intentalo de nuevo");
		return false;
	}

	await saveUser(
		username.value,
		name.value,
		lastname.value,
		mail.value,
		pass.value
	);

	sessionStorage.setItem(
		"session",
		JSON.stringify({
			username: username.value,
			name: name.value,
			lastname: lastname.value,
			mail: mail.value
		})
	);

	setTimeout( function() { window.location.href = "perfil.html"; }, 300 );
});
