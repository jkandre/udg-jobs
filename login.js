import { login } from "./firebase.js";

if(sessionStorage.getItem('session') != null){
	if(JSON.parse(sessionStorage.getItem('session')).username != "" || JSON.parse(sessionStorage.getItem('session')).username != null){
		window.location.href = "http://127.0.0.1:5500/perfil.html";
	}
}

const formLogin = document.getElementById("formLogin");


formLogin.addEventListener("submit", async (e) => {
	e.preventDefault();

	const pass = formLogin["pass"];
    const mail = formLogin["mail"];

	const querySnapshot = await login(mail.value, pass.value);
	if (!(querySnapshot.docs.length > 0)) {
		alert("No se encontraron las credenciales, intentalo de nuevo");
		return false;
	}

	sessionStorage.setItem(
		"session",
		JSON.stringify({
			username: querySnapshot.docs[0].data().username,
			name: querySnapshot.docs[0].data().name,
			lastname: querySnapshot.docs[0].data().lastname,
			mail: querySnapshot.docs[0].data().mail
		})
	);

	setTimeout( function() { window.location.href = "http://127.0.0.1:5500/perfil.html"; }, 300 );
});
