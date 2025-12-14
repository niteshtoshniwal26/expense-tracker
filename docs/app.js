/* ---------- STORAGE ---------- */
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
let categories = JSON.parse(localStorage.getItem("categories") || '["Food","Travel","Shopping","Rent"]');
let payments = JSON.parse(localStorage.getItem("payments") || '["CC","ICICI","SBI","Cash"]');

date.valueAsDate = new Date();

/* ---------- NAV ---------- */
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ---------- ADD ---------- */
function addExpense() {
  const e = {
    id: Date.now(),
    date: date.value,
    amount: Number(amount.value),
    details: details.value.trim(),
    category: category.value,
    payment: payment.value
  };

  if (!e.date || !e.amount || !e.details || !e.category || !e.payment) {
    msg.innerText = "All fields are required";
    return;
  }

  expenses.push(e);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  date.valueAsDate = new Date();
  amount.value = details.value = category.value = payment.value = "";
  msg.innerText = "Expense saved";

  renderExpenses();
}

/* ---------- VIEW (PhonePe-style list) ---------- */
function renderExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const from = fromDate.value;
  const to = toDate.value;
  const search = searchText.value.toLowerCase();

  expenses
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter(e => (!from || e.date >= from) && (!to || e.date <= to))
    .filter(e => !search || e.details.toLowerCase().includes(search))
    .forEach(e => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-header">
          ₹${e.amount}
          <div class="actions">
            <button onclick="editExpense(${e.id})">✏️</button>
            <button onclick="deleteExpense(${e.id})">🗑️</button>
          </div>
        </div>
        <div class="card-sub">
          ${e.details}<br/>
          ${e.date} · ${e.category} · ${e.payment}
        </div>
      `;
      list.appendChild(card);
    });
}

function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

function editExpense(id) {
  const e = expenses.find(x => x.id === id);
  if (!e) return;

  date.value = e.date;
  amount.value = e.amount;
  details.value = e.details;
  category.value = e.category;
  payment.value = e.payment;

  expenses = expenses.filter(x => x.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  showTab("add");
}

/* ---------- SUMMARY ---------- */
function renderSummary() {
  const from = fromMonth.value;
  const to = toMonth.value;

  let total = 0;
  const byCategory = {};
  const byPayment = {};

  expenses
    .filter(e => (!from || e.date >= from) && (!to || e.date <= to))
    .forEach(e => {
      total += e.amount;
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      byPayment[e.payment] = (byPayment[e.payment] || 0) + e.amount;
    });

  summaryTotal.innerText = `Total Spend: ₹${total}`;

  categoryTable.innerHTML =
    `<li><strong>Total: ₹${total}</strong></li>` +
    Object.entries(byCategory)
      .map(([k, v]) => `<li>${k}: ₹${v}</li>`)
      .join("");

  paymentTable.innerHTML =
    `<li><strong>Total: ₹${total}</strong></li>` +
    Object.entries(byPayment)
      .map(([k, v]) => `<li>${k}: ₹${v}</li>`)
      .join("");

  drawPieChart(byCategory);
}

/* ---------- PIE CHART ---------- */
function drawPieChart(data) {
  const canvas = document.getElementById("categoryChart");
  const ctx = canvas.getContext("2d");

  canvas.width = 220;
  canvas.height = 220;

  const values = Object.values(data);
  const total = values.reduce((a, b) => a + b, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!total) return;

  let start = 0;
  const colors = ["#ff9f1c", "#ffb347", "#ffd166", "#f77f00", "#fcbf49"];

  Object.entries(data).forEach(([_, value], i) => {
    const slice = (value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(110, 110);
    ctx.arc(110, 110, 100, start, start + slice);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    start += slice;
  });
}

/* ---------- CONTROL ---------- */
function renderControls() {
  categoryList.innerHTML = categories.map(c =>
    `<li>${c} <button onclick="removeCategory('${c}')">🗑️</button></li>`
  ).join("");

  paymentList.innerHTML = payments.map(p =>
    `<li>${p} <button onclick="removePayment('${p}')">🗑️</button></li>`
  ).join("");

  category.innerHTML = `<option value="">Category</option>` + categories.map(c => `<option>${c}</option>`).join("");
  payment.innerHTML = `<option value="">Payment</option>` + payments.map(p => `<option>${p}</option>`).join("");
}

function addCategory() {
  if (!newCategory.value) return;
  categories.push(newCategory.value);
  localStorage.setItem("categories", JSON.stringify(categories));
  newCategory.value = "";
  renderControls();
}

function addPayment() {
  if (!newPayment.value) return;
  payments.push(newPayment.value);
  localStorage.setItem("payments", JSON.stringify(payments));
  newPayment.value = "";
  renderControls();
}

function removeCategory(c) {
  categories = categories.filter(x => x !== c);
  localStorage.setItem("categories", JSON.stringify(categories));
  renderControls();
}

function removePayment(p) {
  payments = payments.filter(x => x !== p);
  localStorage.setItem("payments", JSON.stringify(payments));
  renderControls();
}

/* ---------- EXPORT & BACKUP ---------- */
function exportCSV() {
  let csv = "ID,Date,Amount,Details,Category,Payment\n";
  expenses.forEach(e => {
    csv += `${e.id},${e.date},${e.amount},${e.details},${e.category},${e.payment}\n`;
  });
  download(csv, "expenses.csv");
}

function exportBackup() {
  download(JSON.stringify({ expenses, categories, payments }), "backup.json");
}

function importBackup(e) {
  const r = new FileReader();
  r.onload = () => {
    const data = JSON.parse(r.result);
    expenses = data.expenses || [];
    categories = data.categories || [];
    payments = data.payments || [];
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("payments", JSON.stringify(payments));
    renderExpenses();
    renderControls();
  };
  r.readAsText(e.target.files[0]);
}

function download(data, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data]));
  a.download = name;
  a.click();
}

/* ---------- INIT ---------- */
renderExpenses();
renderControls();
