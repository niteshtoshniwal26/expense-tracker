// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// Storage keys
const EXPENSES = 'expenses';
const CATEGORIES = 'categories';
const PAYMENTS = 'payments';

// Default values
if (!localStorage.getItem(CATEGORIES))
  localStorage.setItem(CATEGORIES, JSON.stringify(['Food','Travel','Shopping','Rent']));
if (!localStorage.getItem(PAYMENTS))
  localStorage.setItem(PAYMENTS, JSON.stringify(['CC','ICICI','SBI','Cash']));
if (!localStorage.getItem(EXPENSES))
  localStorage.setItem(EXPENSES, JSON.stringify([]));

// Page switch
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  loadDropdowns();
  renderTable();
  renderControl();
}

// Auto date
document.getElementById('date').valueAsDate = new Date();

// Add expense
function addExpense() {
  const expenses = JSON.parse(localStorage.getItem(EXPENSES));
  expenses.push({
    date: date.value,
    amount: amount.value,
    details: details.value,
    category: category.value,
    payment: payment.value
  });
  localStorage.setItem(EXPENSES, JSON.stringify(expenses));
  alert('Saved!');
}

// Load dropdowns
function loadDropdowns() {
  const cats = JSON.parse(localStorage.getItem(CATEGORIES));
  const pays = JSON.parse(localStorage.getItem(PAYMENTS));

  [category, filterCategory].forEach(s => s.innerHTML = '<option value="">All</option>' + cats.map(c => `<option>${c}</option>`).join(''));
  [payment, filterPayment].forEach(s => s.innerHTML = '<option value="">All</option>' + pays.map(p => `<option>${p}</option>`).join(''));
}

// Render table
function renderTable() {
  const expenses = JSON.parse(localStorage.getItem(EXPENSES));
  expenseTable.innerHTML = '';
  expenses.forEach(e => {
    expenseTable.innerHTML += `
      <tr>
        <td>${e.date}</td>
        <td>${e.amount}</td>
        <td>${e.category}</td>
        <td>${e.payment}</td>
        <td>${e.details}</td>
      </tr>`;
  });
}

// Export CSV
function exportCSV() {
  const expenses = JSON.parse(localStorage.getItem(EXPENSES));
  let csv = 'Date,Amount,Category,Payment,Details\n';
  expenses.forEach(e => {
    csv += `${e.date},${e.amount},${e.category},${e.payment},${e.details}\n`;
  });
  const blob = new Blob([csv], {type: 'text/csv'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'expenses.csv';
  link.click();
}

// Control page
function renderControl() {
  categoryList.innerHTML = JSON.parse(localStorage.getItem(CATEGORIES)).map(c => `<li>${c}</li>`).join('');
  paymentList.innerHTML = JSON.parse(localStorage.getItem(PAYMENTS)).map(p => `<li>${p}</li>`).join('');
}

function addCategory() {
  const list = JSON.parse(localStorage.getItem(CATEGORIES));
  list.push(newCategory.value);
  localStorage.setItem(CATEGORIES, JSON.stringify(list));
  renderControl();
}

function addPayment() {
  const list = JSON.parse(localStorage.getItem(PAYMENTS));
  list.push(newPayment.value);
  localStorage.setItem(PAYMENTS, JSON.stringify(list));
  renderControl();
}