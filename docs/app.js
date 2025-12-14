// INITIAL DATA
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

// DEFAULT DATE
document.getElementById("date").valueAsDate = new Date();

// NAVIGATION
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// ADD EXPENSE
function addExpense() {
  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const details = document.getElementById("details").value;
  const category = document.getElementById("category").value;
  const payment = document.getElementById("payment").value;
  const msg = document.getElementById("msg");

  if (!date || !amount || !details || !category || !payment) {
    msg.innerText = "All fields are required";
    return;
  }

  expenses.push({
    id: Date.now(),
    date,
    amount,
    details,
    category,
    payment
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  msg.innerText = "Expense saved";

  renderExpenses();
}

// VIEW EXPENSES
function renderExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  expenses.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>₹${e.amount}</strong> - ${e.details}<br/>
      ${e.date} | ${e.category} | ${e.payment}
    `;
    list.appendChild(li);
  });
}

// INITIAL RENDER
renderExpenses();
