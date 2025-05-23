import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// DOM Ready Stuff
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User logged in:", user.uid);
      await fetchUserData(user.uid);
      await fetchSmartTips(user.uid);
    } else {
      console.warn("No user detected. Redirecting to login.");
      window.location.href = "login.html";
    }
  });

  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogoutBtn = document.getElementById("confirmLogout");
  const cancelLogoutBtn = document.getElementById("cancelLogout");

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logoutModal.style.display = "flex";
  });

  confirmLogoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("Logged out");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      logoutModal.style.display = "none";
    }
  });

  cancelLogoutBtn.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });

  setupAvatarDropdown();
});

// Fetch user profile and preferences, then update UI and charts
async function fetchUserData(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    const prefsRef = doc(db, "userPreferences", uid);
    const prefsSnap = await getDoc(prefsRef);

    let userData = {};

    if (userSnap.exists()) {
      const basicData = userSnap.data();
      userData.name = basicData.name || "User";
    } else {
      console.warn("No name found in 'users' collection.");
    }

    if (prefsSnap.exists()) {
      const dashboardData = prefsSnap.data();
      userData = { ...userData, ...dashboardData };
    } else {
      console.warn("No dashboard data in 'userPreferences'.");
    }

    updateUserDisplay(userData);
    updateDashboard(userData);

  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function updateUserDisplay(userData) {
  const nameDisplay = document.getElementById("usernameDisplay");
  const avatarDisplay = document.getElementById("userAvatar");

  if (userData.name) {
    nameDisplay.textContent = userData.name;
    avatarDisplay.textContent = userData.name.charAt(0).toUpperCase();
  } else {
    nameDisplay.textContent = "User";
    avatarDisplay.textContent = "U";
    console.warn("No name provided in user data.");
  }
}

function updateDashboard(userData) {
  const categories = userData.categoryAmounts || {};
  const totalBudget = parseFloat(userData.budget) || 0;

  // Sum all expenses
  const totalExpenses = Object.values(categories).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

  const remaining = totalBudget - totalExpenses;

  // 🧠 DOM Updates
  document.getElementById("budgetValue").textContent = totalBudget.toFixed(2);
  document.getElementById("expenseValue").textContent = totalExpenses.toFixed(2);

  const remainingText = `${remaining.toFixed(2)} (${remaining >= 0 ? 'On Track!' : 'Overspending!'})`;
  document.getElementById("remainingValue").textContent = remainingText;

  // 💡 Color Logic
  const budgetCard = document.querySelector(".budget-cards .card:nth-child(1)");
  const expenseCard = document.querySelector(".budget-cards .card:nth-child(2)");
  const remainingCard = document.querySelector(".budget-cards .card:nth-child(3)");

  const remainingPercent = (totalBudget === 0) ? 0 : (remaining / totalBudget) * 100;

  // Reset card styles
  [budgetCard, expenseCard, remainingCard].forEach(card => {
    card.style.backgroundColor = ""; // reset any weird leftover styles
  });

  if (remaining < 0) {
    alert("⚠️ You're spending more than your budget!");
    budgetCard.style.backgroundColor = "#f8d7da";
    remainingCard.style.backgroundColor = "#f8d7da";
  } else if (remainingPercent >= 50) {
    budgetCard.style.backgroundColor = "#d4edda";
    remainingCard.style.backgroundColor = "#d4edda";
  } else if (remainingPercent >= 20) {
    budgetCard.style.backgroundColor = "#fff3cd";
    remainingCard.style.backgroundColor = "#fff3cd";
  } else {
    budgetCard.style.backgroundColor = "#f8d7da";
    remainingCard.style.backgroundColor = "#f8d7da";
  }

  expenseCard.style.backgroundColor = "#e2e3e5";

  // 🥧 Charts
  const pieLabels = Object.keys(categories);
  const pieData = Object.values(categories);

  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: pieLabels,
      datasets: [{
        data: pieData,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#F67019"]
      }]
    }
  });

  drawSavingsLineChart(userData);
}

function drawSavingsLineChart(userData) {
  const savings = userData.savingsHistory || [];

  if (!savings.length) {
    console.warn("No savings history found for the user.");
    return;
  }

  // Sort history by date
  const sorted = savings.sort((a, b) => new Date(a.date) - new Date(b.date));
  const lineLabels = sorted.map(entry => entry.date);
  const lineData = sorted.map(entry => entry.amount);

  const ctx = document.getElementById("lineChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: lineLabels,
      datasets: [{
        label: "Savings Over Time",
        data: lineData,
        borderColor: "#6c63ff",
        backgroundColor: "rgba(108, 99, 255, 0.2)",
        pointBackgroundColor: "#6c63ff",
        fill: true,
        tension: 0.3,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: "Date" },
          ticks: { autoSkip: true, maxTicksLimit: 10 }
        },
        y: {
          title: { display: true, text: "Amount (₹)" },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#333",
            font: { size: 14, weight: "bold" }
          }
        }
      }
    }
  });
}

async function fetchSmartTips(uid) {
  try {
    const res = await fetch("https://smartsave-ai.onrender.com/api/ai/generate-tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid })
    });

    const data = await res.json();
    const tipText = document.getElementById("aiTip");
    tipText.textContent = data.reply;
  } catch (err) {
    console.error("Failed to load AI tips:", err);
    document.getElementById("ai-tip-text").textContent = "Error loading tips.";
  }
}

function setupAvatarDropdown() {
  const avatar = document.getElementById("userAvatar");
  const dropdown = document.getElementById("avatarDropdown");

  if (!avatar || !dropdown) return;

  avatar.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  window.addEventListener("click", (event) => {
    if (!event.target.matches("#userAvatar")) {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    }
  });
}

document.getElementById("hamburgerMenu").addEventListener("click", () => {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
});

// Dashboard export option
document.getElementById("exportPdfBtn").addEventListener("click", () => {
  const dashboardContent = document.getElementById("dashboardContent");

  const opt = {
    margin:       0.5,
    filename:     'SmartSave-Dashboard.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(dashboardContent).save();
});