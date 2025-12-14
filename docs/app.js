let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

date.valueAsDate = new Date();

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ADD */
function addExpense() {
  const e = {
    id: Date.now(),
    date: date.value,
    amount: Number(amount.value),
    details: details.value,
    category: category.value,
    payment: payment.value
  };

  if (!Object.values(e).every(v => v)) {
    msg.innerText = "All fields required";
    return;
  }

  expenses.push(e);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  date.valueAsDate = new Date();
  amount.value = details.value = category.value = payment.value = "";
  msg.innerText = "Saved";

  renderExpenses();
}

/* VIEW */
function renderExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const from = fromDate.value;
  const to = toDate.value;
  const search = searchText.value.toLowerCase();

  expenses
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter(e => (!from || e.date >= from) && (!to || e.date <= to))
    .filter(e => !search || e.details.toLowerCase().includes(search))
    .forEach(e => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
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
      list.appendChild(div);
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
  date.value = e.date;
  amount.value = e.amount;
  details.value = e.details;
  category.value = e.category;
  payment.value = e.payment;
  expenses = expenses.filter(x => x.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  showTab("add");
}

/* SUMMARY */
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

  categoryTable.innerHTML = Object.entries(byCategory)
    .map(([k, v]) => `<li>${k}: ₹${v}</li>`)
    .join("");

  paymentTable.innerHTML = Object.entries(byPayment)
    .map(([k, v]) => `<li>${k}: ₹${v}</li>`)
    .join("");

  drawPieChart(byCategory);
}

/* PIE CHART */
function drawPieChart(data) {
  const canvas = document.getElementById("categoryChart");
  const ctx = canvas.getContext("2d");
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  let start = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Object.entries(data).forEach(([_, value], i) => {
    const slice = (value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 90, start, start + slice);
    ctx.fillStyle = ["#ff9f1c", "#ffb347", "#ffd166", "#f77f00"][i % 4];
    ctx.fill();
    start += slice;
  });
}

/* EXPORT */
function exportCSV() {
  let csv = "ID,Date,Amount,Details,Category,Payment\n";
  expenses.forEach(e => {
    csv += `${e.id},${e.date},${e.amount},${e.details},${e.category},${e.payment}\n`;
  });
  download(csv, "expenses.csv");
}

function download(data, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data]));
  a.download = name;
  a.click();
}

renderExpenses();
