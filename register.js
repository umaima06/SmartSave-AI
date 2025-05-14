// 🔥 Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAuylaOXF0uFDpgWitCS4IVDgCl_bDw8zw",
  authDomain: "smartsave-ai-backend.firebaseapp.com",
  projectId: "smartsave-ai-backend",
  storageBucket: "smartsave-ai-backend.appspot.com",
  messagingSenderId: "878148375077",
  appId: "1:878148375077:web:7f4059e336dadc2d03a5cc",
  measurementId: "G-FTT8FZV12B"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 💾 Register Form Logic
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords don't match 😬");
    return;
  }

  try {
    // 🔐 Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🗃️ Save user details to Firestore under 'users' collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    // 💾 Save UID in localStorage to use on Dashboard
    localStorage.setItem("uid", user.uid);

    // 🎉 Redirect to homepage or dashboard
    window.location.href = "index.html";
  } catch (err) {
    console.error("Signup Error 👉", err.code, err.message);
    alert("Error: " + err.message);
  }
});

// 👀 Toggle Password Visibility
window.togglePassword = function (iconSpan, inputId) {
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
};