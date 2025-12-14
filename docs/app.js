// ---------- DEBUG MARKER ----------
document.body.insertAdjacentHTML(
  "afterbegin",
  "<h1 style='color:red'>JS LOADED</h1>"
);

// ---------- STORAGE ----------
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
let categories = JSON.parse(localStorage.getItem("categories") || '["Food","Travel","Shopping","Rent"]');
let payments = JSON.parse(localStorage.getItem("payments") || '["CC","ICICI","SBI","Cash"]');

// ---------- PIN ----------
if (!localStorage.getItem("pin")) {
  localStorage.setItem("pin", "2604");
}

function unlockApp() {
  const input = document.getElementById("pin-input").value;

  if (input === localStorage.getItem("pin")) {
    document.getElementById("pin-screen").style.display = "none";
    document.getElementById("app").style.display = "block";
    init();
  } else {
    document.getElementById("pin-msg").innerText = "Incorrect PIN";
  }
}

// ---------- INIT ----------
function init() {
  document.getElementById("date").valueAsDate = new Date();
  loadDropdowns();
  renderExpenses();
  showTab("add");
}

// ---------- NAV ----------
function showTab(id) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

// ---------- ADD EXPENSE ----------
function addExpense() {
  const dateEl = document.getElementById("date");
  const amountEl = document.getElementById("amount");
  const detailsEl = document.getElementById("details");
  const categoryEl = document.getElementById("category");
  const paymentEl = document.getElementById("payment");
  const msgEl = document.getElementById("add-msg");

  const expense = {
    id: Date.now(),
    date: dateEl.value,
    amount: amountEl.value,
    details: detailsEl.value,
    category: categoryEl.value,
    payment: paymentEl.value
  };

  if (!Object.values(expense).every(v => v)) {
    msgEl.innerText = "All fields are required";
    return;
  }

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  msgEl.innerText = "Expense saved";
  dateEl.valueAsDate = new Date();
  amountEl.value = "";
  detailsEl.value = "";

  renderExpenses();
}

// ---------- VIEW ----------
function renderExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  expenses.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${e.date} | ₹${e.amount} | ${e.details} | ${e.category} | ${e.payment}
      <button onclick="deleteExpense(${e.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
  }
}

// ---------- CONTROL ----------
function loadDropdowns() {
  const categoryEl = document.getElementById("category");
  const paymentEl = document.getElementById("payment");

  categoryEl.innerHTML = categories.map(c => `<option>${c}</option>`).join("");
  paymentEl.innerHTML = payments.map(p => `<option>${p}</option>`).join("");
}

function addCategory() {
  const input = document.getElementById("newCategory");
  if (!input.value) return;

  categories.push(input.value);
  localStorage.setItem("categories", JSON.stringify(categories));
  input.value = "";
