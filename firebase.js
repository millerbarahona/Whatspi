import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider }from "firebase/auth" ;

const firebaseConfig = {
  apiKey: "AIzaSyCvh6nDAe5GqsCaMzFccezBXj0pyrl7PTU",
  authDomain: "wathsapp20-89876.firebaseapp.com",
  projectId: "wathsapp20-89876",
  storageBucket: "wathsapp20-89876.appspot.com",
  messagingSenderId: "1072498381706",
  appId: "1:1072498381706:web:e8909165a65193f6dfee73",
  measurementId: "G-GDP9HFZDKB"
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, db, provider}