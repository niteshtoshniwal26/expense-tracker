// STORAGE
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
let categories = JSON.parse(localStorage.getItem("categories") || '["Food","Travel","Shopping","Rent"]');
let payments = JSON.parse(localStorage.getItem("payments") || '["CC","ICICI","SBI","Cash"]');

// PIN
if (!localStorage.getItem("pin")) {
    localStorage.setItem("pin", btoa("2604"));
}
document.getElementById("pin-screen").classList.remove("hidden");

function unlockApp() {
  const input = document.getElementById("pin-input").value;
  if (btoa(input) === localStorage.getItem("pin")) {
    document.getElementById("pin-screen").style.display ="none"; 
    document.getElementById("app").style.display ="block";
    init();
  } else {
    document.getElementById("pin-msg").innerText = "Incorrect PIN";
  }
}

// INIT
function init() {
  document.getElementById("date").valueAsDate = new Date();
  loadDropdowns();
  renderExpenses();
}

// NAV
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ADD
function addExpense() {
  const e = {
    id: Date.now(),
    date: date.value,
    amount: amount.value,
    details: details.value,
    category: category.value,
    payment: payment.value
  };
  if (!Object.values(e).every(v => v)) {
    add-msg.innerText = "All fields required";
    return;
  }
  expenses.push(e);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  add-msg.innerText = "Saved";
  renderExpenses();
}

// VIEW
function renderExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";
  expenses.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `${e.date} | ₹${e.amount} | ${e.details} | ${e.category} | ${e.payment}
      <button onclick="deleteExpense(${e.id})">Delete</button>`;
    list.appendChild(li);
  });
}

function deleteExpense(id) {
  if (confirm("Confirm delete?")) {
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
  }
}

// CONTROL
function loadDropdowns() {
  category.innerHTML = filterCategory.innerHTML = categories.map(c => `<option>${c}</option>`).join("");
  payment.innerHTML = filterPayment.innerHTML = payments.map(p => `<option>${p}</option>`).join("");
}

function addCategory() {
  categories.push(newCategory.value);
  localStorage.setItem("categories", JSON.stringify(categories));
  loadDropdowns();
}

function addPayment() {
  payments.push(newPayment.value);
  localStorage.setItem("payments", JSON.stringify(payments));
  loadDropdowns();
}

// EXPORT
function exportCSV() {
  let csv = "Date,Amount,Details,Category,Payment\n";
  expenses.forEach(e => {
    csv += `${e.date},${e.amount},${e.details},${e.category},${e.payment}\n`;
  });
  download(csv, "expenses.csv");
}

// BACKUP
function exportBackup() {
  download(JSON.stringify({expenses, categories, payments}), "backup.json");
}

function importBackup(e) {
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    expenses = data.expenses;
    categories = data.categories;
    payments = data.payments;
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("payments", JSON.stringify(payments));
    loadDropdowns();
    renderExpenses();
  };
  reader.readAsText(e.target.files[0]);
}

function download(data, file) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data]));
  a.download = file;
  a.click();

}

