import { 
	getVacancyDetails, 
	statusVacancy, 
	getCandidatesUsernames,
	getUserInfo,
	getUserKnowledge,
	getProfessions,
	getTopics
} from "./firebase.js";

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
let querySnapshotCandidatesUsernames;
let professions;
let topics;

window.addEventListener("DOMContentLoaded", async () => {
	professions = await getProfessions();
	topics = await getTopics();
	querySnapshotVacancyDetail = await getVacancyDetails(
		parseInt(new URLSearchParams(window.location.search).get("id"))
	);

	if (!querySnapshotVacancyDetail.docs.length > 0) {
		alert(
			"Ocurrrio un error al obtener los detalles de la vacante, contacte con el administrador"
		);
		return false;
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
	bold.innerHTML = "Salario: ";
	const payment = document.createElement("p");
	// payment.classList.add("vacante_descripcion");
	payment.innerHTML = "$ " + querySnapshotVacancyDetail.docs[0].data().payment;
	divPair.appendChild(bold);
	divPair.appendChild(payment);

	//Div pair time
	const divPairTime = document.createElement("div");
	divPairTime.classList.add("pair");
	const boldTime = document.createElement("bold");
	boldTime.innerHTML = "Jornada: ";
	const time = document.createElement("p");
	// time.classList.add("vacante_descripcion");
	time.innerHTML = querySnapshotVacancyDetail.docs[0].data().time + " horas";
	divPairTime.appendChild(boldTime);
	divPairTime.appendChild(time);

	//Descripcion
	const boldDesc = document.createElement("bold");
	boldDesc.innerHTML = "Descripcion: ";
	const desc = document.createElement("p");
	desc.classList.add("vacante_descripcion");
	desc.innerHTML = querySnapshotVacancyDetail.docs[0].data().description;

	const btnEliminar = document.createElement("button");
	btnEliminar.classList.add("btnDeleteTopic");
	btnEliminar.innerHTML = "Deshabilitar";

	btnEliminar.addEventListener("click", async (e) => {
		e.preventDefault();
		const parent = e.target.parentNode;
		let status;
		if (parent.classList.contains("disableVacancy")) {
			status = true;
			await statusVacancy(parseInt(parent.firstChild.innerHTML), status);
			parent.lastElementChild.innerHTML = "Deshabilitar";
			parent.lastElementChild.classList.add("btnDeleteTopic");
			parent.lastElementChild.classList.remove("btnAddTopic");
			parent.classList.remove("disableVacancy");
		} else {
			status = false;
			await statusVacancy(parseInt(parent.firstChild.innerHTML), status);
			parent.lastElementChild.innerHTML = "Habilitar";
			parent.lastElementChild.classList.remove("btnDeleteTopic");
			parent.lastElementChild.classList.add("btnAddTopic");
			parent.classList.add("disableVacancy");
		}
	}, false);

	vacanciesDiv.appendChild(idVacancy);
	vacanciesDiv.appendChild(title);
	vacanciesDiv.appendChild(divPair);
	vacanciesDiv.appendChild(divPairTime);
	vacanciesDiv.appendChild(boldDesc);
	vacanciesDiv.appendChild(desc);
	vacanciesDiv.appendChild(btnEliminar);

	//Parte para agregar a los aspirantes

	querySnapshotCandidatesUsernames = await getCandidatesUsernames(
		parseInt(new URLSearchParams(window.location.search).get("id"))
	);

	if (!querySnapshotCandidatesUsernames.docs.length > 0) {
		return;
	}			

	const divCandidates = document.getElementById("divCandidates");

	let user;

	querySnapshotCandidatesUsernames.forEach(async (doc) => {
		user = doc.data().username;

		//div del candidato
		const candidate = document.createElement("div");
		candidate.classList.add("candidate");
		
		//Username del candidato
		const idUsername = document.createElement("input");
		idUsername.setAttribute("value", user);
		idUsername.setAttribute("hidden", true);


		//Nombre del candidato
		const nameDiv = document.createElement("div");
		nameDiv.classList.add("pairCandidate");
		const nameBold = document.createElement("bold");
		nameBold.innerHTML = "Nombre: ";
		const name = document.createElement("p");
		name.innerHTML = doc.data().name + " " + doc.data().lastname;
		nameDiv.appendChild(nameBold);
		nameDiv.appendChild(name);

		//Correo del candidato
		const mailDiv = document.createElement("div");
		mailDiv.classList.add("pairCandidate");
		const mailBold = document.createElement("bold");
		mailBold.innerHTML = "Mail: ";
		const mail = document.createElement("p");
		mail.innerHTML = doc.data().mail;
		mailDiv.appendChild(mailBold);
		mailDiv.appendChild(mail);

		let querySnapshotUserInfo = await getUserInfo(user);
		let querySnapshotUserKnowledge = await getUserKnowledge(user);

		//Codigo para agregar info complementaria del usuario
		let userProfessionP;
		let cvUser;
		const professionDiv = document.createElement("div");

		if(querySnapshotUserInfo.docs.length > 0){
			//Profesion del candidato
			
			professionDiv.classList.add("pairCandidate");
			const professionBold = document.createElement("bold");
			professionBold.innerHTML = "Profesion: ";
			userProfessionP = document.createElement("p");
			professions.forEach(doc1 => {
				if(doc1.data().professionId == querySnapshotUserInfo.docs[0].data().userProfession){
					userProfessionP.innerHTML = doc1.data().professionName;
				}
			});
			professionDiv.appendChild(professionBold);
			professionDiv.appendChild(userProfessionP);

			//CV del candidato
			cvUser = document.createElement("input");
			cvUser.setAttribute("value", querySnapshotUserInfo.docs[0].data().CV);
			cvUser.setAttribute("hidden", true);
		}

		candidate.appendChild(idUsername);
		candidate.appendChild(nameDiv);
		candidate.appendChild(professionDiv);
		candidate.appendChild(mailDiv);
		
		//Codigo para agregar info de conocimientos de usuario
		if(querySnapshotUserKnowledge.docs.length > 0){
			//Conocimientos del candidato
			const topicsCandidate = document.createElement("div");
			const conocimientos = document.createElement("bold");
			conocimientos.innerHTML = "Conocimientos";
			topicsCandidate.appendChild(conocimientos);

			querySnapshotUserKnowledge.forEach(doc2 => {
				const userTopic = document.createElement("p");
				topics.forEach(t => {
					if(t.data().idTopic == doc2.data().idTopic){
						userTopic.innerHTML = "Rate " + t.data().topicName + ": " + doc2.data().knowledge;
						topicsCandidate.appendChild(userTopic);
					}
				});
			});

			candidate.appendChild(topicsCandidate);
		}

		
		candidate.appendChild(cvUser);
		divCandidates.appendChild(candidate);

		candidate.addEventListener("click", async (e) => {
			e.preventDefault();

			const iframe = document.getElementById("iframePDF");
			iframe.style.height = "700px";

			iframe.setAttribute("src", "data:application/pdf;base64,"+candidate.children[candidate.children.length-1].value);

			iframe.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
			
		});
	});


});
