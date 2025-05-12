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
