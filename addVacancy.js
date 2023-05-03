import {
	getVacancyID,
	saveVacancy,
	getProfessions,
	getProfessionsTopics,
	saveVacancyRequirements
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

const username = document.getElementById("username");
username.innerHTML =
	"Bienvenido: " + JSON.parse(sessionStorage.getItem("session")).companyName;

const registerVancancyForm = document.getElementById("registerVancancyForm");

const topics = document.getElementById("topics");
let querySnapshotTopics;
const btnAddTopic = document.getElementById("btnAddTopic");
const btnDeleteTopic = document.getElementById("btnDeleteTopic");

const selectorProfession = document.getElementById("selecterProfession");

registerVancancyForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	let topicArray = [];
	let topicRate = [];

	let childrensLength = topics.childElementCount;
	for (let index = 0; index < childrensLength; index++) {
		const select = document.getElementById("topic_"+(index+1));
		const idTopic = select.value;

		if(topicArray.includes(parseInt(idTopic))){
			alert(
				"No puedes repetir los topicos requeridos, verifica e intentalo de nuevo"
			);
			return;
		}else{
			topicArray.push(parseInt(idTopic));
			topicRate.push(parseInt(registerVancancyForm["rateTopic_"+(index+1)].value));
		}
	}

	const tittle = registerVancancyForm["vacante"];
	const payment = registerVancancyForm["sueldo"];
	const time = registerVancancyForm["jornadaRadio"];
	const description = registerVancancyForm["descripcion"];

	const querySnapshotID = await getVacancyID();
	if (!querySnapshotID.docs.length > 0) {
		alert(
			"Ocurrrio un error al agregar la vacante, contacte con el administrador"
		);
		return;
	}
	const profession = registerVancancyForm["profession"];

	let objTopics = [];
	for (let index = 0; index < topicArray.length; index++) {
		objTopics.push({
			idTopic: topicArray[index],
			rateNeeded: topicRate[index], 
			idVacancy: parseInt(querySnapshotID.docs[0].data().idVacancy) + 1,
			idCompany: parseInt(JSON.parse(sessionStorage.getItem("session")).idCompany),
			idProfession: parseInt(profession.value)
		})
	}

	await saveVacancy(
		tittle.value,
		parseFloat(payment.value),
		parseInt(time.value),
		description.value,
		parseInt(querySnapshotID.docs[0].data().idVacancy) + 1,
		parseInt(JSON.parse(sessionStorage.getItem("session")).idCompany),
		parseInt(profession.value)
	);

	await saveVacancyRequirements(objTopics);

	setTimeout(function () {
		window.location.href = "empresaHome.html";
	}, 300);
});

window.addEventListener("DOMContentLoaded", async () => {
	const selectorProfession = document.getElementById("selecterProfession");
	const querySnapshotProfession = await getProfessions();
	if (!querySnapshotProfession.docs.length > 0) {
		alert(
			"Ocurrrio un error al obtener las profesiones registradas, contacte con el administrador"
		);
		return false;
	}

	for (let i = 0; i < querySnapshotProfession.docs.length; i++) {
		// <option value="value1">Value 1</option>
		const option = document.createElement("option");
		option.setAttribute(
			"value",
			querySnapshotProfession.docs[i].data().professionId
		);
		option.innerHTML = querySnapshotProfession.docs[i].data().professionName;

		if (i == 0) {
			option.setAttribute("Selected", true);

			querySnapshotTopics = await getProfessionsTopics(
				parseInt(querySnapshotProfession.docs[i].data().professionId)
			);
			if (!querySnapshotTopics.docs.length > 0) {
				alert(
					"Ocurrrio un error al agregar la vacante, contacte con el administrador"
				);
				return false;
			}

			let childrensLength = topics.childElementCount;
			const pairTopics = document.createElement("div");
			pairTopics.classList.add("pairTopics");

			const select = document.createElement("select");
			select.setAttribute("id", "topic_" + (childrensLength + 1));

			const input = document.createElement("input");
			input.setAttribute("type", "number");
			input.setAttribute("name", "rateTopic_" + (childrensLength + 1));
			input.setAttribute("placeholder", "Dominio del 0-10");
			input.setAttribute("min", "0");
			input.setAttribute("max", "10");
			input.setAttribute("required", "true");

			topics.appendChild(pairTopics);
			pairTopics.appendChild(select);
			pairTopics.appendChild(input);

			querySnapshotTopics.forEach((doc) => {
				select.options[select.options.length] = new Option(
					doc.data().topicName,
					doc.data().idTopic
				);
			});
		}

		selectorProfession.appendChild(option);
	}
});

btnAddTopic.addEventListener("click", async (e) => {
	e.preventDefault();

	let childrensLength = topics.childElementCount;

	if (querySnapshotTopics.docs.length == childrensLength) {
		alert("No hay mas topicos para agregar");
		return false;
	}

	const pairTopics = document.createElement("div");
	pairTopics.classList.add("pairTopics");

	const select = document.createElement("select");
	select.setAttribute("id", "topic_" + (childrensLength + 1));

	const input = document.createElement("input");
	input.setAttribute("type", "number");
	input.setAttribute("name", "rateTopic_" + (childrensLength + 1));
	input.setAttribute("placeholder", "Dominio del 0-10");
	input.setAttribute("min", "0");
	input.setAttribute("max", "10");
	input.setAttribute("required", "true");

	topics.appendChild(pairTopics);
	pairTopics.appendChild(select);
	pairTopics.appendChild(input);

	querySnapshotTopics.forEach((doc) => {
		select.options[select.options.length] = new Option(
			doc.data().topicName,
			doc.data().idTopic
		);
	});
});

btnDeleteTopic.addEventListener("click", async (e) => {
	e.preventDefault();

	let childrensLength = topics.childElementCount;

	if (childrensLength > 1) {
		topics.removeChild(topics.lastElementChild);
	} else {
		alert("No puedes eliminar todos los topicos");
	}
});

selectorProfession.addEventListener("change", async (e) => {
	const profession = registerVancancyForm["profession"];

	querySnapshotTopics = await getProfessionsTopics(
		parseInt(profession.value)
	);

	while(topics.childElementCount > 0){
		topics.removeChild(topics.lastElementChild);
	}

	if (!querySnapshotTopics.docs.length > 0) {
		alert(
			"Ocurrrio un error al agregar la vacante, contacte con el administrador"
		);
		return false;
	}

	let childrensLength = topics.childElementCount;
	const pairTopics = document.createElement("div");
	pairTopics.classList.add("pairTopics");

	const select = document.createElement("select");
	select.setAttribute("id", "topic_" + (childrensLength + 1));

	const input = document.createElement("input");
	input.setAttribute("type", "number");
	input.setAttribute("name", "rateTopic_" + (childrensLength + 1));
	input.setAttribute("placeholder", "Dominio del 0-10");
	input.setAttribute("min", "0");
	input.setAttribute("max", "10");
	input.setAttribute("required", "true");

	topics.appendChild(pairTopics);
	pairTopics.appendChild(select);
	pairTopics.appendChild(input);

	querySnapshotTopics.forEach((doc) => {
		select.options[select.options.length] = new Option(
			doc.data().topicName,
			doc.data().idTopic
		);
	});
})