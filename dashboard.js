// dashboard.js
import { auth, db } from './firebase.js'; // import from firebase.js
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 👤 Track Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log("User logged in:", uid);
    await fetchUserData(uid); // Fetch user data
  } else {
    console.log("User is not logged in");
    window.location.href = "login.html";
  }
});

// 🧠 Fetch User Data
async function fetchUserData(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const nameDisplay = document.getElementById("usernameDisplay");
      const avatarDisplay = document.getElementById("userAvatar");

      // Ensure that userData.name is not null or undefined
      if (userData.name) {
        nameDisplay.textContent = userData.name;
        avatarDisplay.textContent = userData.name[0].toUpperCase(); // first letter for avatar
      } else {
        console.warn("No name in user data.");
      }
    } else {
      console.warn("No user data found.");
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
}

// 📊 Dummy Data, Charts & Navbar
document.addEventListener("DOMContentLoaded", () => {
  // Dummy Budget Values
  document.getElementById("budgetValue").textContent = "5000";
  document.getElementById("expenseValue").textContent = "2200";
  document.getElementById("remainingValue").textContent = "2800";

  // Chart Setup
  const pieCtx = document.getElementById("pieChart");
  const lineCtx = document.getElementById("lineChart");

  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Food", "Transport", "Shopping"],
      datasets: [{
        data: [1200, 600, 400],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }]
    }
  });

  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr"],
      datasets: [{
        label: "Expenses Over Time",
        data: [1000, 1800, 2200, 2800],
        borderColor: "#6c63ff",
        fill: false
      }]
    }
  });

  // 👤 Avatar Dropdown
  const avatar = document.getElementById("userAvatar");
  const dropdown = document.getElementById("avatarDropdown");

  avatar.addEventListener("click", () => {
    dropdown.classList.toggle("show-dropdown");
  });

  window.addEventListener("click", (e) => {
    if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("show-dropdown");
    }
  });
}) 

 // 🔓 Logout
// Logout button to trigger the modal
const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const confirmLogoutBtn = document.getElementById("confirmLogout");
const cancelLogoutBtn = document.getElementById("cancelLogout");

// Show modal when logout button is clicked
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logoutModal.style.display = "flex"; // Show the modal
});

// If the user confirms logout
confirmLogoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html"; // redirect after logging out
  } catch (error) {
    console.error("Error logging out:", error);
  }
  logoutModal.style.display = "none"; // Hide the modal
});

// If the user cancels logout
cancelLogoutBtn.addEventListener("click", () => {
  logoutModal.style.display = "none"; // Close the modal
});

// Mobile Navbar
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
window.toggleMenu = toggleMenu;