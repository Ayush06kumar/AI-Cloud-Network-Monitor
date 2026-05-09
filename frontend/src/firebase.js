import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAs_G6T_cBXK-HLX-B6-KzQX3WBQ50v87M",
  authDomain: "ai-cloud-network-monitor.firebaseapp.com",
  projectId: "ai-cloud-network-monitor",
  storageBucket: "ai-cloud-network-monitor.firebasestorage.app",
  messagingSenderId: "481612824654",
  appId: "1:481612824654:web:865aca29d416d0cb1fc31f",
  measurementId: "G-PCLTJSSZTN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);