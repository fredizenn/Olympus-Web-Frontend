// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOEEfPvTJOnpCwI9KEBVfGHIzqnvdrJlA",
  authDomain: "hmsys-58b48.firebaseapp.com",
  projectId: "hmsys-58b48",
  storageBucket: "hmsys-58b48.appspot.com",
  messagingSenderId: "1049304170218",
  appId: "1:1049304170218:web:1cf19b9a7012ccfbe2e193",
  measurementId: "G-DTVVBNCKDB"
};

// Initialize Firebase

let analytics;

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);

export const hmSysDb = getFirestore(app);

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics }