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
	limit 
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

export const saveUser = (username, name, lastname, mail, pass) => {
	addDoc(collection(db, "users"), {
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

export const saveTopic = (username, topicName, topicRate) => {
	addDoc(collection(db, "topic_users"), {
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
		q = query(collection(db, "vacancy"), where("title", "==", search));
	}else if(limit != null){
		q = query(collection(db, "vacancy"), orderBy("payment"));
	}else{
		q = query(collection(db, "vacancy"), orderBy("payment"));
	}
	
	return await getDocs(q);
};


// const q = query(citiesRef, where("population", ">", 100000), orderBy("population"), limit(2));