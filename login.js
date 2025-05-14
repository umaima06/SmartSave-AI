// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuylaOXF0uFDpgWitCS4IVDgCl_bDw8zw",
  authDomain: "smartsave-ai-backend.firebaseapp.com",
  projectId: "smartsave-ai-backend",
  storageBucket: "smartsave-ai-backend.firebasestorage.app",
  messagingSenderId: "878148375077",
  appId: "1:878148375077:web:7f4059e336dadc2d03a5cc",
  measurementId: "G-FTT8FZV12B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form submit logic
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store UID in localStorage
    localStorage.setItem("uid", user.uid);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Login failed: " + err.message);
    console.error(err);
  }
});

// Toggle password visibility
function togglePassword(iconSpan, inputId) {
  const input = document.getElementById(inputId);
  const icon = iconSpan.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleIcon = document.querySelector(".toggle-password");
    toggleIcon?.addEventListener("click", function () {
      togglePassword(this, "password");
    });
  });