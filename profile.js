import {
	getProfessions,
	getProfessionsTopics,
	saveUserKnowledge,
	saveProfile,
	getUserInfo,
	getUserKnowledge,
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
const btnAddTopic = document.getElementById("btnAddTopic");
const btnDeleteTopic = document.getElementById("btnDeleteTopic");

const dropbox = document.getElementById("dropbox");

const img = document.getElementById("imgPDF");

let querySnapshotProfession;
let querySnapshotTopics;

let querySnapshotUserInfo;
let querySnapshotUserKnowledge;

formPesos.addEventListener("submit", async (e) => {
	e.preventDefault();

	let topicArray = [];
	let topicRate = [];

	let childrensLength = topics.childElementCount;
	for (let index = 0; index < childrensLength; index++) {
		const select = document.getElementById("topic_" + (index + 1));
		const idTopic = select.value;

		if (topicArray.includes(parseInt(idTopic))) {
			alert(
				"No puedes repetir los topicos requeridos, verifica e intentalo de nuevo"
			);
			return;
		} else {
			topicArray.push(parseInt(idTopic));
			topicRate.push(parseInt(formPesos["rateTopic_" + (index + 1)].value));
		}
	}

	let objTopics = [];
	for (let index = 0; index < topicArray.length; index++) {
		objTopics.push({
			idTopic: topicArray[index],
			knowledge: topicRate[index],
			username: JSON.parse(sessionStorage.getItem("session")).username,
		});
	}

	let base64 = null;
	const files = document.getElementById("fileInput").files;

	const file = files[0];

	if (file != null) {
		const reader = new FileReader();
		reader.onloadend = () => {
			base64 = reader.result.replace("data:", "").replace(/^.+,/, "");
		};
		reader.readAsDataURL(file);
		await sleep(500);
	}

	// const iframePDF = document.getElementById("iframePDF");
	// iframePDF.setAttribute("src", "data:application/pdf;base64,"+base64+"");

	await saveProfile(
		JSON.parse(sessionStorage.getItem("session")).username,
		parseInt(formPesos["profession"].value),
		base64
	);

	await saveUserKnowledge(
		objTopics,
		JSON.parse(sessionStorage.getItem("session")).username
	);

	alert("Datos guardados");
	window.location.href = "busqueda.html";
});

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

window.addEventListener("DOMContentLoaded", async () => {
	querySnapshotProfession = await getProfessions();
	querySnapshotTopics = await getProfessionsTopics();

	querySnapshotUserInfo = await getUserInfo(
		JSON.parse(sessionStorage.getItem("session")).username
	);
	querySnapshotUserKnowledge = await getUserKnowledge(
		JSON.parse(sessionStorage.getItem("session")).username
	);

	let userProfession = false;

	const selectorProfession = document.getElementById("selecterProfession");
	if (!querySnapshotProfession.docs.length > 0) {
		alert(
			"Ocurrrio un error al obtener las profesiones registradas, contacte con el administrador"
		);
		return false;
	}

	if (
		!querySnapshotUserInfo.docs.length > 0 ||
		!querySnapshotUserKnowledge.docs.length > 0
	) {
		alert(
			"Completa tu perfil para tener mas oportunidades de ser seleccionado"
		);
	}

	if (querySnapshotUserInfo.docs.length > 0) {
		userProfession = true;
	}

	for (let i = 0; i < querySnapshotProfession.docs.length; i++) {
		// <option value="value1">Value 1</option>
		const option = document.createElement("option");
		option.setAttribute(
			"value",
			querySnapshotProfession.docs[i].data().professionId
		);
		option.innerHTML = querySnapshotProfession.docs[i].data().professionName;

		//Selecciona una profesion por defecto
		if (i == 0 && !userProfession) {
			option.setAttribute("Selected", true);

			// querySnapshotTopics = await getProfessionsTopics(
			// 	parseInt(querySnapshotProfession.docs[i].data().professionId)
			// );
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
				if (
					doc.data().idProfession ==
					parseInt(querySnapshotProfession.docs[i].data().professionId)
				) {
					select.options[select.options.length] = new Option(
						doc.data().topicName,
						doc.data().idTopic
					);
				}
			});
		}

		if (
			userProfession &&
			querySnapshotUserInfo.docs[0].data().userProfession ==
				querySnapshotProfession.docs[i].data().professionId
		) {
			option.setAttribute("Selected", true);
			if (querySnapshotUserKnowledge.docs.length > 0) {
				querySnapshotUserKnowledge.forEach((docKnowledge) => {
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
					input.setAttribute("value", docKnowledge.data().knowledge);

					topics.appendChild(pairTopics);
					pairTopics.appendChild(select);
					pairTopics.appendChild(input);

					querySnapshotTopics.forEach((doc) => {
						if (
							doc.data().idProfession ==
							parseInt(querySnapshotUserInfo.docs[0].data().userProfession)
						) {
							select.options[select.options.length] = new Option(
								doc.data().topicName,
								doc.data().idTopic
							);
							if (doc.data().idTopic == docKnowledge.data().idTopic) {
								select.options[select.options.length - 1].setAttribute(
									"Selected",
									true
								);
							}
						}
					});
				});
			} else {
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
					if (
						doc.data().idProfession ==
						parseInt(querySnapshotProfession.docs[i].data().professionId)
					) {
						select.options[select.options.length] = new Option(
							doc.data().topicName,
							doc.data().idTopic
						);
					}
				});
			}
		}

		selectorProfession.appendChild(option);
	}

	if (userProfession) {
		if (querySnapshotUserInfo.docs[0].data().CV != null) {

			let pdf = querySnapshotUserInfo.docs[0].data().CV;
			const fileInput = document.getElementById("fileInput");
			const byteCharacters = atob(pdf);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			// Crear un objeto Blob a partir del archivo binario
			const blob = new Blob([byteArray], { type: "application/pdf" });
			// Crear un objeto File a partir del objeto Blob
			const file = new File([blob], "CV.pdf", { type: "application/pdf" });
			// Agregar el objeto File a la lista de archivos del elemento de entrada de archivo HTML
			var files = [file];
			fileInput.files = new FileListItems(files);

			const img = document.createElement("img");
			img.setAttribute("src", "img/pdf.png");
			dropbox.innerHTML = "";
			dropbox.appendChild(img);
			img.style.display = "block";

			const p = document.createElement("p");
			p.innerHTML = files[0].name;
			dropbox.appendChild(p);
			p.style.display = "block";

			img.addEventListener("click", async (e) => {
				let base64;
				const file = fileInput.files[0];

				const reader = new FileReader();
				reader.onloadend = () => {
					base64 = reader.result.replace("data:", "").replace(/^.+,/, "");
				};
				reader.readAsDataURL(file);
				await sleep(500);

				var objbuilder = "";
				objbuilder +=
					'<object width="100%" height="100%" data="data:application/pdf;base64,';
				objbuilder += base64;
				objbuilder += '" type="application/pdf" class="internal">';
				objbuilder += '<embed src="data:application/pdf;base64,';
				objbuilder += base64;
				objbuilder += '" type="application/pdf"  />';
				objbuilder += "</object>";

				var win = window.open("#", "_blank");
				var title = "CV-PDF";
				win.document.write(
					"<html><title>" +
						title +
						'</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">'
				);
				win.document.write(objbuilder);
				win.document.write("</body></html>");
			});
		}
	}
});

btnAddTopic.addEventListener("click", async (e) => {
	e.preventDefault();

	let childrensLength = topics.childElementCount;

	let topicsProfession = querySnapshotTopics.docs.filter(
		(doc) => doc.data().idProfession == parseInt(formPesos["profession"].value)
	);

	if (topicsProfession.length == childrensLength) {
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

	topicsProfession.forEach((doc) => {
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

	querySnapshotTopics = await getProfessionsTopics(parseInt(profession.value));

	while (topics.childElementCount > 0) {
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
});

dropbox.addEventListener("dragenter", (e) => {
	e.stopPropagation();
	e.preventDefault();
});

dropbox.addEventListener("dragover", (e) => {
	e.stopPropagation();
	e.preventDefault();
});

dropbox.addEventListener("drop", (e) => {
	e.stopPropagation();
	e.preventDefault();

	// const file = e.dataTransfer.files[0];

	const dt = e.dataTransfer;
	const files = dt.files;

	if (!(files[0].type === "application/pdf")) {
		alert("Solo se permiten archivos .pdf, verifica y vuelve a intentarlo");
	}

	const fileInput = document.getElementById("fileInput");
	fileInput.files = files;

	const img = document.createElement("img");
	img.setAttribute("src", "img/pdf.png");
	dropbox.innerHTML = "";
	dropbox.appendChild(img);
	img.style.display = "block";

	const p = document.createElement("p");
	p.innerHTML = files[0].name;
	dropbox.appendChild(p);
	p.style.display = "block";

	img.addEventListener("click", async (e) => {
		let base64;
		const file = fileInput.files[0];

		const reader = new FileReader();
		reader.onloadend = () => {
			base64 = reader.result.replace("data:", "").replace(/^.+,/, "");
		};
		reader.readAsDataURL(file);
		await sleep(500);

		var objbuilder = "";
		objbuilder +=
			'<object width="100%" height="100%" data="data:application/pdf;base64,';
		objbuilder += base64;
		objbuilder += '" type="application/pdf" class="internal">';
		objbuilder += '<embed src="data:application/pdf;base64,';
		objbuilder += base64;
		objbuilder += '" type="application/pdf"  />';
		objbuilder += "</object>";

		var win = window.open("#", "_blank");
		var title = "CV-PDF";
		win.document.write(
			"<html><title>" +
				title +
				'</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">'
		);
		win.document.write(objbuilder);
		win.document.write("</body></html>");
	});
});

function FileListItems(files) {
	var b = new ClipboardEvent("").clipboardData || new DataTransfer();
	for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i]);
	return b.files;
}
