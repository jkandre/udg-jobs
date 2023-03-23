import { getTopics, saveTopic, getUserTopics } from "./firebase.js";

if (sessionStorage.getItem("session") != null) {
	if (
		JSON.parse(sessionStorage.getItem("session")).username == "" ||
		JSON.parse(sessionStorage.getItem("session")).username == null
	) {
		window.location.href = "index.html";
	}
}else{
	window.location.href = "index.html";
}

const username = document.getElementById("username");
username.innerHTML =
	"Bienvenido: " + JSON.parse(sessionStorage.getItem("session")).username;

const name_profile = document.getElementById("name_profile");
name_profile.innerHTML =
	"Nombre: " + JSON.parse(sessionStorage.getItem("session")).name + " " + JSON.parse(sessionStorage.getItem("session")).lastname;
const mail_profile = document.getElementById("mail_profile");
mail_profile.innerHTML =
	"Correo: " + JSON.parse(sessionStorage.getItem("session")).mail;

const btnAddTopic = document.getElementById("btnAddTopic");
const btnDeleteTopic = document.getElementById("btnDeleteTopic");

const topics = document.getElementById("topics");
let querySnapshotTopics;

const formPesos = document.getElementById("formPesos");

formPesos.addEventListener("submit", async (e) => {
	e.preventDefault();

	let childrensLength = topics.childElementCount;
	let username = JSON.parse(sessionStorage.getItem("session")).username;

	for (let i = 0; i < childrensLength; i++) {
		await saveTopic(
			username,
			document.getElementById("topic_" + (i + 1)).value,
			formPesos["rateTopic_" + (i + 1)].value
		);
	}

	setTimeout(function () {
		window.location.href = "perfil.html";
	}, 300);
});

logoutForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	sessionStorage.clear();

	window.location.href = "index.html";
});

btnAddTopic.addEventListener("click", async (e) => {
	e.preventDefault();

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
			doc.data().topicName
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

window.addEventListener("DOMContentLoaded", async () => {

	querySnapshotTopics = await getTopics();

	const querySnapshot = await getUserTopics(
		JSON.parse(sessionStorage.getItem("session")).username
	);
	if (querySnapshot.docs.length > 0) {

		topics.removeChild(topics.lastElementChild);

		for (let i = 0; i < querySnapshot.docs.length; i++) {
			const pairTopics = document.createElement("div");
			pairTopics.classList.add("pairTopics");

			const select = document.createElement("select");
			select.setAttribute("id", "topic_" + (i + 1));

			const input = document.createElement("input");
			input.setAttribute("type", "number");
			input.setAttribute("name", "rateTopic_" + (i + 1));
			input.setAttribute("placeholder", "Dominio del 0-10");
			input.setAttribute("min", "0");
			input.setAttribute("max", "10");
			input.setAttribute("required", "true");
			input.setAttribute("value", querySnapshot.docs[i].data().topicRate);

			topics.appendChild(pairTopics);
			pairTopics.appendChild(select);
			pairTopics.appendChild(input);

			querySnapshotTopics.forEach((doc) => {
				select.options[select.options.length] = new Option(
					doc.data().topicName,
					doc.data().topicName
				);

				if(doc.data().topicName == querySnapshot.docs[i].data().topicName){
					select.options[select.options.length-1].setAttribute("Selected", true);
				}
			});

		}


	} 
	else 
	{
		const topic_1 = document.getElementById("topic_1");

		querySnapshotTopics.forEach((doc) => {
			topic_1.options[topic_1.options.length] = new Option(
				doc.data().topicName,
				doc.data().topicName
			);
		});
	}
});
