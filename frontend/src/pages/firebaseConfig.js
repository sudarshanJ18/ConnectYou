import { initializeApp } from "firebase/app"; // Import Firebase app
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"; // Import auth-related modules

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDJjuJhCFKu0rIgo5VBhrP0aYl3UmP6Els",
  authDomain: "connect-you-8edbf.firebaseapp.com",
  projectId: "connect-you-8edbf",
  storageBucket: "connect-you-8edbf.appspot.com",
  messagingSenderId: "263548267571",
  appId: "1:263548267571:web:5e675d8f14f5bba5f90746",
  measurementId: "G-98ZB5ZQNLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export auth and providers
export { auth, googleProvider, facebookProvider };