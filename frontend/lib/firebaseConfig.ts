// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2qdzmNdg68vK5EwQy_zphvel7l2GxSQE",
  authDomain: "insight-analyst-6f98b.firebaseapp.com",
  projectId: "insight-analyst-6f98b",
  storageBucket: "insight-analyst-6f98b.firebasestorage.app",
  messagingSenderId: "819711819725",
  appId: "1:819711819725:web:eb06401939e32485fd4e84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)