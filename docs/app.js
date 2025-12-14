let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

// Default date
document.getElementById("date").valueAsDate = new Date();

// Navigation
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// Add Expense
function addExpense() {
  const dateEl = document.getElementById("date");
  const amountEl = document.getElementById("amount");
  const detailsEl = document.getElementById("details");
  const categoryEl = document.getElementById("category");
  const paymentEl = document.getElementById("payment");
  const msg = document.getElementById("msg");

  if (!dateEl.value || !amountEl.value || !detailsEl.value || !categoryEl.value || !paymentEl.value) {
    msg.innerText = "All fields are required";
    return;
  }

  expenses.push({
    id: Date.now(),
    date: dateEl.value,
    amount: amountEl.value,
    details: detailsEl.value,
    category: categoryEl.value,
    payment: paymentEl.value
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Clear form
  dateEl.valueAsDate = new Date();
  amountEl.value = "";
  detailsEl.value = "";
  categoryEl.value = "";
  paymentEl.value = "";
  msg.innerText = "Expense saved";

  renderExpenses();
}

// Render Expenses with Filters
function renderExpenses() {
  const list = document.getElementById("expense-list");
  const filterCategory = document.getElementById("filterCategory").value;
  const filterPayment = document.getElementById("filterPayment").value;

  list.innerHTML = "";

  expenses
    .filter(e => !filterCategory || e.category === filterCategory)
    .filter(e => !filterPayment || e.payment === filterPayment)
    .forEach(e => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>₹${e.amount}</strong> - ${e.details}<br/>
        ${e.date} | ${e.category} | ${e.payment}<br/>
        <button onclick="editExpense(${e.id})">Edit</button>
        <button onclick="deleteExpense(${e.id})">Delete</button>
      `;
      list.appendChild(li);
    });
}

// Delete Expense
function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;

  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

// Edit Expense (simple re-fill form)
function editExpense(id) {
  const e = expenses.find(x => x.id === id);
  if (!e) return;

  document.getElementById("date").value = e.date;
  document.getElementById("amount").value = e.amount;
  document.getElementById("details").value = e.details;
  document.getElementById("category").value = e.category;
  document.getElementById("payment").value = e.payment;

  expenses = expenses.filter(x => x.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  showTab("add");
}

// Initial render
renderExpenses();
