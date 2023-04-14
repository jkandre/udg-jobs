import { 
		getProfessions, 
		getProfessionsTopics,
		saveUserKnowledge,
		saveProfile,
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

const username = document.getElementById("username");
username.innerHTML =
	"Bienvenido: " + JSON.parse(sessionStorage.getItem("session")).username;

const name_profile = document.getElementById("name_profile");
name_profile.innerHTML =
	"Nombre: " +
	JSON.parse(sessionStorage.getItem("session")).name +
	" " +
	JSON.parse(sessionStorage.getItem("session")).lastname;
const mail_profile = document.getElementById("mail_profile");
mail_profile.innerHTML =
	"Correo: " + JSON.parse(sessionStorage.getItem("session")).mail;

const formPesos = document.getElementById("formPesos");

const selectorProfession = document.getElementById("selecterProfession");
const topics = document.getElementById("topics");
let querySnapshotTopics;
const btnAddTopic = document.getElementById("btnAddTopic");
const btnDeleteTopic = document.getElementById("btnDeleteTopic");

formPesos.addEventListener("submit", async (e) => {
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
			topicRate.push(parseInt(formPesos["rateTopic_"+(index+1)].value));
		}
	}

	let objTopics = [];
	for (let index = 0; index < topicArray.length; index++) {
		objTopics.push({
			idTopic: topicArray[index],
			knowledge: topicRate[index], 
			username: JSON.parse(sessionStorage.getItem("session")).username
		})
	}

	await saveProfile(
		JSON.parse(sessionStorage.getItem("session")).username,
		parseInt(formPesos["profession"].value)
	);

	await saveUserKnowledge(objTopics, JSON.parse(sessionStorage.getItem("session")).username);
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
	const profession = formPesos["profession"];

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