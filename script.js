import { db, auth } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { saveSavingsGoal } from "./firebase.js";

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

  try {
    await setDoc(userDocRef, {
      selectedCategories,
      categoryAmounts,
      savingsGoal,
      budget: totalBudget,
      expenses: 0
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

// 🎯 Save goal button (optional, but you already handle in main save, so can be removed or kept)
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
document.getElementById("saveBudgetBtn").addEventListener("click", () => {
  const budgetInput = document.getElementById("totalBudgetInput").value;
  const confirmation = document.getElementById("budgetConfiguration");
  if (budgetInput && budgetInput > 0) {
    totalBudget = parseFloat(budgetInput);
    confirmation.innerText = 'Total Budget  set to ₹${totalBudget}';
    confirmation.style.color = "green";
    confirmation.style.display = "block";
    updateRemainingAmount();
  } else {
    confirmation.innerText = "Please enter a valid budget amount.";
    confirmation.style.color = "red";
    confirmation.style.display = "block";
}
});

// Reusable function to calculate total expenses
function getTotalExpenses() {
  const inputs = document.querySelectorAll(".amount-input");
  let total = 0;
  inputs.forEach(input => {
    if (!input.disabled && input.value) {
      total += parseFloat(input.value);
    }
  });
  return total;
}

// Update remaining amount whenever expenses or budget change
function updateRemainingAmount() {
  const totalExpenses = getTotalExpenses();
  const remaining = totalBudget - totalExpenses;
  document.getElementById("total-amount").innerText = totalExpenses;

  let remainingEl = document.getElementById("remaining-amount");
  if (!remainingEl) {
    const newEl = document.createElement("p");
    newEl.id = "remaining-amount";
    newEl.innerHTML = `<strong>Remaining (Savings):</strong> ₹${remaining}`;
    document.getElementById("total-container").appendChild(newEl);
  } else {
    remainingEl.innerHTML = `<strong>Remaining (Savings):</strong> ₹${remaining}`;
  }
}

// Update remaining whenever expenses are changed
document.querySelectorAll(".amount-input").forEach(input => {
  input.addEventListener("input", updateRemainingAmount);
});

// Also call update when categories are checked/unchecked
document.querySelectorAll(".category-check").forEach(check => {
  check.addEventListener("change", updateRemainingAmount);
});