// firebase.js (Frontend side)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAuylaOXF0uFDpgWitCS4IVDgCl_bDw8zw",
  authDomain: "smartsave-ai-backend.firebaseapp.com",
  projectId: "smartsave-ai-backend",
  storageBucket: "smartsave-ai-backend.appspot.com",
  messagingSenderId: "878148375077",
  appId: "1:878148375077:web:7f4059e336dadc2d03a5cc",
  measurementId: "G-FTT8FZV12B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services to export
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services to use in other files
export { auth, db };