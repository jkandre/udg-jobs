// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
	query,
	where,
	orderBy, 
	limit,
	updateDoc,
	doc,
	writeBatch
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDE4-SMLmZq3Hspvlr3rmZj1B_jrlcbWtQ",
	authDomain: "udg-jobs.firebaseapp.com",
	projectId: "udg-jobs",
	storageBucket: "udg-jobs.appspot.com",
	messagingSenderId: "452834709476",
	appId: "1:452834709476:web:08308b6736523d851881f1",
	measurementId: "G-3DC1JLMW1E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const saveUser = async (username, name, lastname, mail, pass) => {
	await addDoc(collection(db, "users"), {
		username,
		name,
		lastname,
		mail,
		pass,
	});
};

export const validateUser = async (username) => {
	const q = query(collection(db, "users"), where("username", "==", username));

	return await getDocs(q);
};

export const validateMail = async (mail) => {
	const q = query(collection(db, "users"), where("mail", "==", mail));

	return await getDocs(q);
};

export const login = async (mail, pass) => {
	const q = query(collection(db, "users"), where("mail", "==", mail), where("pass", "==", pass));

	return await getDocs(q);
};

export const getTopics = async () => {
	return await getDocs(collection(db, "topics"));
};

export const saveTopic = async (username, topicName, topicRate) => {
	await addDoc(collection(db, "topic_users"), {
		username,
		topicName,
		topicRate
	});
};

export const getUserTopics = async (username) => {
	const q = query(collection(db, "topic_users"), where("username", "==", username));

	return await getDocs(q);
};

export const getVacants = async (limit = null, search = null) => {
	let q;

	if(search != null){
		q = query(collection(db, "vacancy"), where("title", "==", search), where("isActive", "==", true));
	}else if(limit != null){
		q = query(collection(db, "vacancy"), where("isActive", "==", true), orderBy("payment"));
	}else{
		q = query(collection(db, "vacancy"), where("isActive", "==", true));
	}
	return await getDocs(q);
};

export const validateMailCompany = async (companyMail) => {
	const q = query(collection(db, "companies"), where("mail", "==", companyMail));

	return await getDocs(q);
};

export const validateIDCompany = async (idCompany) => {
	const q = query(collection(db, "companies"), where("idCompany", "==", idCompany));

	return await getDocs(q);
};

export const saveCompany = async (name, mail, adress, pass, idCompany) => {
	await addDoc(collection(db, "companies"), {
		name,
		mail,
		adress,
		pass,
		idCompany
	});
};

export const getCompanyID = async () => {
	const q = query(collection(db, "companies"), orderBy("idCompany", "desc"), limit(1));

	return await getDocs(q);
};

export const loginCompany = async (mail, pass) => {
	const q = query(collection(db, "companies"), where("mail", "==", mail), where("pass", "==", pass));

	return await getDocs(q);
};

export const getVacantsPublished = async (idCompany) => {
	const q = query(collection(db, "vacancy"), where("idCompany", "==", idCompany), where("isActive", "==", true));
	
	return await getDocs(q);
};

export const getVacancyID = async () => {
	const q = query(collection(db, "vacancy"), orderBy("idVacancy", "desc"), limit(1));

	return await getDocs(q);
};

export const saveVacancy = async (title, payment, time, description, idVacancy, idCompany, idProfession) => {
	await addDoc(collection(db, "vacancy"), {
		title,
		payment,
		time,
		description,
		idVacancy,
		idCompany,
		idProfession,
		isActive: true
	});
};

export const statusVacancy = async (idVacancy, status) => {
	const q = query(collection(db, "vacancy"), where("idVacancy", "==", idVacancy));

	const vacancyId = await getDocs(q);

	if(vacancyId.docs.length > 0){
		const vacancyRef = doc(db, "vacancy", vacancyId.docs[0].id);

		return await updateDoc(vacancyRef, {
			isActive: status
		});
	}
};

export const getProfessions = async () => {
	const q = query(collection(db, "profession"));

	return await getDocs(q);
};

export const addTopic = async (idProfession, topicName) => {
	await addDoc(collection(db, "topics"), {
		idProfession,
		topicName
	});
};

export const getProfessionsTopics = async (idProfession) => {
	let q;
	if(idProfession != null){
		q = query(collection(db, "topics"), where("idProfession", "==", idProfession));
	}else{
		q = query(collection(db, "topics"));
	}

	return await getDocs(q);
};

export const saveVacancyRequirements = async (arrayRequirements) => {
	const batch = writeBatch(db);

	arrayRequirements.forEach((document) => {
		const docRef = doc(collection(db, "vacancyRequirements"))
		batch.set(docRef, document);
	});
	
	// Commit the batch
	await batch.commit();
};

export const saveUserKnowledge = async (arrayKnowledge, username) => {
	const q = query(collection(db, "topic_users"), where("username", "==", username));
	const userTopics = await getDocs(q);

	const batch = writeBatch(db);

	for (let i = 0; i < userTopics.docs.length; i++) {
		const userTopicRef = doc(db, "topic_users", userTopics.docs[i].id);
		batch.delete(userTopicRef);
	}

	arrayKnowledge.forEach((document) => {
		const docRef = doc(collection(db, "topic_users"))
		batch.set(docRef, document);
	});
	
	// Commit the batch
	await batch.commit();
};

export const saveProfile = async (username, userProfession = null, cv = null) => {
	const q = query(collection(db, "userProfile"), where("username", "==", username));

	const userProfile = await getDocs(q);

	if(userProfile.docs.length > 0){
		const userRef = doc(db, "userProfile", userProfile.docs[0].id);

		return await updateDoc(userRef, {
			userProfession: userProfession,
			CV: cv
		});
	}else{
		await addDoc(collection(db, "userProfile"), {
			username,
			userProfession,
			cv
		});
	}
};

export const getUserInfo = async (username) => {
	const q = query(collection(db, "userProfile"), where("username", "==", username));

	return await getDocs(q);
};

export const getUserKnowledge = async (username) => {
	const q = query(collection(db, "topic_users"), where("username", "==", username));

	return await getDocs(q);
};

export const getVacancyDetails = async (idVacancy) => {
	const q = query(collection(db, "vacancy"), where("idVacancy", "==", idVacancy));

	return await getDocs(q);
};

export const getCandidatesUsernames = async (idVacancy) => {
	const q = query(collection(db, "applications"), where("idVacancy", "==", idVacancy));

	const querySnapshot = await getDocs(q);

	let usernamesArray = [];

	querySnapshot.forEach((doc) => {
		usernamesArray.push(doc.data().username);
	});

	const users = query(collection(db, "users"), where("username", "in", usernamesArray));

	return await getDocs(users);
};

export const validateApplication = async (username, idVacancy) => {
	const q = query(collection(db, "applications"), where("username", "==", username), where("idVacancy", "==", idVacancy));

	return await getDocs(q);
};

export const saveApplication = async (username, idVacancy) => {
	await addDoc(collection(db, "applications"), {
		username,
		idVacancy
	});
};

export const getVacantsSalary = async () => {
	const q = query(collection(db, "vacancy"), orderBy("payment", "desc"));
	
	return await getDocs(q);
};

export const getVacantWeights = async (idVacancy) => {
	const q = query(collection(db, "vacancyRequirements"), where("idVacancy", "==", idVacancy));

	return await getDocs(q);
};
