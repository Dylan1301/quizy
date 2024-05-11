import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const API_URL = "http://144.91.127.242:8000";
export const COLORS = ["orange", "green", "blue", "purple", "yellow", "red"];

const firebaseConfig = {
  apiKey: "AIzaSyAgreXLtAs0qsWBbXpR_nQNWYXatEJ9Ky8",
  authDomain: "quizy-3d149.firebaseapp.com",
  projectId: "quizy-3d149",
  storageBucket: "quizy-3d149.appspot.com",
  messagingSenderId: "818217105784",
  appId: "1:818217105784:web:72d8863dd9367db554b08d",
  measurementId: "G-YYLSSHE0XL",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseFirestore = getFirestore(app);
