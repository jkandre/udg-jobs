import { validateMailCompany, saveCompany, getCompanyID } from "./firebase.js";

if (sessionStorage.getItem("session") != null) {
	if (
		JSON.parse(sessionStorage.getItem("session")).mail != "" &&
		JSON.parse(sessionStorage.getItem("session")).mail != null
	) {
		window.location.href = "empresaHome.html";
	}
}

const registerCompanyForm = document.getElementById("registerCompanyForm");

registerCompanyForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const pass = registerCompanyForm["pass1"];
	let pass2 = registerCompanyForm["pass2"].value;
	if (pass.value != pass2) {
		alert("Las contraseñas no coinciden");
		return false;
	}

	const name = registerCompanyForm["nombre"];
	const mail = registerCompanyForm["correo"];
	const adress = registerCompanyForm["adress"];

	const querySnapshotMail = await validateMailCompany(mail.value);
	if (querySnapshotMail.docs.length > 0) {
		alert("El mail ya esta registrado, intentalo de nuevo");
		return false;
	}

	const querySnapshotID = await getCompanyID();
	if (!querySnapshotID.docs.length > 0) {
		alert("Ocurrrio un error al registrar, contacte con el administrador");
		return false;
	}
	
	await saveCompany(
		name.value,
		mail.value,
		adress.value,
		pass.value,
		parseInt(querySnapshotID.docs[0].data().idCompany) + 1
	);

	sessionStorage.setItem(
		"session",
		JSON.stringify({
			name: name.value,
			mail: mail.value,
			adress: adress.value,
			idCompany: parseInt(querySnapshotID.docs[0].data().idCompany) + 1
		})
	);

	setTimeout( function() { window.location.href = "empresaHome.html"; }, 300 );
});
