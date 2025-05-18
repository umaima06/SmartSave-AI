import { db, auth } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { saveSavingsGoal } from "./firebase.js";


const saveBudgetAndCategories = async (uid, budget, categoryAmounts) => {
  try {
    const prefsRef = doc(db, "userPreferences", uid);
    await setDoc(prefsRef, {
      budget,
      categoryAmounts,
    }, { merge: true });
    console.log("✅ Budget & categories saved.");
  } catch (error) {
    console.error("❌ Error saving budget and categories:", error);
  }
};


// 🧠 Fill missing days in savingsHistory (kept inside firebase.js, so removed here)

document.getElementById("generate-budget-btn").addEventListener("click", async () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

  const categoryAmounts = {};
  selectedCategories.forEach(cat => {
    const inputId = document.querySelector(`input[data-target][value="${cat}"]`).dataset.target;
    const amountInput = document.getElementById(inputId);
    const amount = parseFloat(amountInput.value) || 0;
    categoryAmounts[cat] = amount;
  });

  const savingsGoal = parseFloat(document.getElementById("savingsGoalInput").value) || 0;

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first!");
    return;
  }

  const userDocRef = doc(db, "userPreferences", user.uid);
  const totalExpenses = Object.values(categoryAmounts).reduce((sum, amt) => sum + amt, 0);

  try {
    await setDoc(userDocRef, {
      selectedCategories,
      categoryAmounts,
      savingsGoal,
      budget: totalBudget,
      expenses: totalExpenses
    }, { merge: true });

    // Save savings goal + history after budget data is saved
    await saveSavingsGoal(savingsGoal, user.uid);

    console.log("🔥 User data saved to Firestore with savings goal + history:");
    console.log("Categories:", selectedCategories);
    console.log("Amounts:", categoryAmounts);
    console.log("Savings Goal: ₹", savingsGoal);
    console.log("Total Budget: ₹", totalBudget);

    alert("✅ Budget and savings goal saved! Redirecting to dashboard...");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("❌ Error saving data:", err);
    alert("Error saving budget or savings goal. Try again!");
  }
});

// 🧃 Checkbox toggle input
document.querySelectorAll(".category-check").forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const inputId = checkbox.dataset.target;
    const input = document.getElementById(inputId);
    input.disabled = !checkbox.checked;
    if (!checkbox.checked) input.value = "";
  });
});

// 💸 Total amount calculator
const amountInputs = document.querySelectorAll(".amount-input");
const totalAmountEl = document.getElementById("total-amount");

amountInputs.forEach(input => {
  input.addEventListener("input", () => {
    let total = 0;
    amountInputs.forEach(inp => {
      if (!inp.disabled && inp.value) {
        total += parseFloat(inp.value);
      }
    });
    totalAmountEl.textContent = total.toFixed(2);
  });
});

// Save goal button (optional, but you already handle in main save, so can be removed or kept)
document.getElementById("saveGoalBtn")?.addEventListener("click", async () => {
  const goalInput = parseFloat(document.getElementById("savingsGoalInput").value);
  const confirmation = document.getElementById("goalConfirmation");
  const user = auth.currentUser;

  if (!goalInput || goalInput <= 0) {
    confirmation.textContent = "Please enter a valid amount!";
    confirmation.style.color = "red";
    confirmation.style.display = "block";
    return;
  }

  if (!user) {
    alert("Please log in first!");
    return;
  }

  try {
    await saveSavingsGoal(goalInput, user.uid);
    confirmation.textContent = `₹${goalInput} goal saved! 🔥`;
    confirmation.style.color = "green";
    confirmation.style.display = "block";
    console.log("✅ Savings goal + history updated!");
  } catch (err) {
    console.error("❌ Error saving goal:", err);
    confirmation.textContent = "Error saving goal. Try again!";
    confirmation.style.color = "red";
    confirmation.style.display = "block";
  }
});

let totalBudget = 0;

// Handle budget save
document.getElementById("saveBudgetBtn").addEventListener("click", async () => {
  const budgetInput = parseFloat(document.getElementById("totalBudgetInput").value);
  const confirmation = document.getElementById("budgetConfirmation");
  const user = auth.currentUser;

  if (!budgetInput || budgetInput <= 0) {
    confirmation.innerText = "Please enter a valid budget amount.";
    confirmation.style.color = "red";
    confirmation.style.display = "block";
    return;
  }

  if (!user) {
    alert("Please log in first!");
    return;
  }

  totalBudget = budgetInput;
  confirmation.innerText = `Total Budget set to ₹${totalBudget}`;
  confirmation.style.color = "green";
  confirmation.style.display = "block";

  try {
    await setDoc(doc(db, "userPreferences", user.uid), {
      budget: totalBudget,
    }, { merge: true });

    console.log("✅ Budget saved in Firestore: ₹" + totalBudget);
  } catch (err) {
    console.error("❌ Error saving budget:", err);
    confirmation.innerText = "Error saving budget. Try again!";
    confirmation.style.color = "red";
    confirmation.style.display = "block";
  }

  const categoryAmounts = {};
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(cat => {
    const inputId = cat.dataset.target;
    const amount = parseFloat(document.getElementById(inputId).value) || 0;
    categoryAmounts[cat.value] = amount;
  });

  await saveBudgetAndCategories(user.uid, totalBudget, categoryAmounts);

  updateRemainingAmount();
});document.getElementById("saveBudgetBtn").addEventListener("click", async () => {
  const budgetInput = parseFloat(document.getElementById("totalBudgetInput").value);
  const confirmation = document.getElementById("budgetConfirmation");
  const user = auth.currentUser;

  if (!budgetInput || budgetInput <= 0) {
    confirmation.innerText = "Please enter a valid budget amount.";
    confirmation.style.color = "red";
    confirmation.style.display = "block";
    return;
  }

  if (!user) {
    alert("Please log in first!");
    return;
  }

  totalBudget = budgetInput;
  confirmation.innerText = `Total Budget set to ₹${totalBudget}`;
  confirmation.style.color = "green";
  confirmation.style.display = "block";

  try {
    await setDoc(doc(db, "userPreferences", user.uid), {
      budget: totalBudget,
    }, { merge: true });

    console.log("✅ Budget saved in Firestore: ₹" + totalBudget);
  } catch (err) {
    console.error("❌ Error saving budget:", err);
    confirmation.innerText = "Error saving budget. Try again!";
    confirmation.style.color = "red";
    confirmation.style.display = "block";
  }

  updateRemainingAmount();
});

