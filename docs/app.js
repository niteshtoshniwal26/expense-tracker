let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

document.getElementById("date").valueAsDate = new Date();

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

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

function renderExpenses() {
  const tbody = document.getElementById("expense-table");
  const from = fromDate.value;
  const to = toDate.value;
  const search = searchText.value.toLowerCase();

  tbody.innerHTML = "";

  expenses
    .filter(e => (!from || e.date >= from) && (!to || e.date <= to))
    .filter(e => !search || e.details.toLowerCase().includes(search))
    .forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.id}</td>
        <td>${e.date}</td>
        <td>${e.amount}</td>
        <td>${e.details}</td>
        <td>${e.category}</td>
        <td>${e.payment}</td>
        <td>
          <button onclick="editExpense(${e.id})">Edit</button>
          <button onclick="deleteExpense(${e.id})">Del</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

function deleteExpense(id) {
  if (!confirm("Delete?")) return;
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

function exportCSV() {
  let csv = "ID,Date,Amount,Details,Category,Payment\n";
  expenses.forEach(e => {
    csv += `${e.id},${e.date},${e.amount},${e.details},${e.category},${e.payment}\n`;
  });
  download(csv, "expenses.csv");
}

function exportBackup() {
  download(JSON.stringify(expenses), "expense-backup.json");
}

function importBackup(e) {
  const r = new FileReader();
  r.onload = () => {
    expenses = JSON.parse(r.result);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
  };
  r.readAsText(e.target.files[0]);
}

function download(data, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data]));
  a.download = name;
  a.click();
}

function renderSummary() {
  const month = summaryMonth.value;
  let total = 0;
  summaryList.innerHTML = "";

  expenses.filter(e => e.date.startsWith(month)).forEach(e => {
    total += Number(e.amount);
    const li = document.createElement("li");
    li.innerText = `${e.category} - ₹${e.amount}`;
    summaryList.appendChild(li);
  });

  summaryTotal.innerText = `Total: ₹${total}`;
}

renderExpenses();
