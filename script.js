document.querySelectorAll(".category-check").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const inputId = checkbox.dataset.target;
    const input = document.getElementById(inputId);
    input.disabled = !checkbox.checked;
    if (!checkbox.checked) input.value = "";
  });
});

document.getElementById("budget-form").addEventListener("submit", function (e) {
  e.preventDefault();
  // Redirect to dashboard later or process form
  alert("Redirecting to your budget dashboard...");
});

const amountInputs = document.querySelectorAll(".amount-input");
const totalAmountEl = document.getElementById("total-amount");

amountInputs.forEach((input) => {
  input.addEventListener("input", () => {
    let total = 0;
    amountInputs.forEach((inp) => {
      if (!inp.disabled && inp.value) {
        total += parseFloat(inp.value);
      }
    });
    totalAmountEl.textContent = total.toFixed(2);
  });
});

  function saveGoal() {
    const goalInput = document.getElementById('savingsGoalInput').value;
    const confirmation = document.getElementById('goalConfirmation');

    if (goalInput && goalInput > 0) {
      confirmation.textContent = `₹${goalInput} goal saved! 🔥`;
      confirmation.style.display = 'block';

      // Optionally save to localStorage for now
      localStorage.setItem("monthlyGoal", goalInput);
    } else {
      confirmation.textContent = "Please enter a valid amount!";
      confirmation.style.color = "red";
      confirmation.style.display = 'block';
    }
  }