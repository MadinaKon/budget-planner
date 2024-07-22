document.getElementById("add-btn").addEventListener("click", addTransaction);
document.getElementById("save-btn").addEventListener("click", saveTransaction);
document.getElementById("cancel-btn").addEventListener("click", cancelEdit);

let transactions = [];
let currentTransactionId = null;

function addTransaction() {
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (description && !isNaN(amount)) {
    const transaction = {
      id: generateID(),
      description,
      amount,
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateSummary();

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
  }
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
  const list = document.getElementById("transaction-list");

  const item = document.createElement("li");

  item.classList.add(transaction.amount > 0 ? "income" : "expense");
  item.innerHTML = `
        ${transaction.description} 
        <span>${transaction.amount > 0 ? "+" : "-"}$${Math.abs(
    transaction.amount
  ).toFixed(2)}</span>
        <button class="edit-btn" onclick="editTransaction(${
          transaction.id
        })">edit</button>
        <button class="delete-btn" onclick="removeTransaction(${
          transaction.id
        })">x</button>
    `;

  list.appendChild(item);
}

function updateSummary() {
  const totalIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);

  const netBalance = totalIncome - totalExpense;

  document.getElementById("total-income").innerText = totalIncome.toFixed(2);
  document.getElementById("total-expense").innerText = totalExpense.toFixed(2);
  document.getElementById("net-balance").innerText = netBalance.toFixed(2);
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  init();
}

function editTransaction(id) {
  currentTransactionId = id;
  const transaction = transactions.find((transaction) => transaction.id === id);

  document.getElementById("edit-description").value = transaction.description;
  document.getElementById("edit-amount").value = transaction.amount;

  document.querySelector(".form-group").style.display = "none";
  document.querySelector(".edit-group").style.display = "flex";
}

function saveTransaction() {
  const description = document.getElementById("edit-description").value;
  const amount = parseFloat(document.getElementById("edit-amount").value);

  if (description && !isNaN(amount) && currentTransactionId !== null) {
    const transaction = transactions.find(
      (transaction) => transaction.id === currentTransactionId
    );
    transaction.description = description;
    transaction.amount = amount;

    currentTransactionId = null;
    document.querySelector(".form-group").style.display = "flex";
    document.querySelector(".edit-group").style.display = "none";

    init();
  }
}

function cancelEdit() {
  currentTransactionId = null;
  document.querySelector(".form-group").style.display = "flex";
  document.querySelector(".edit-group").style.display = "none";
}

function init() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateSummary();
}

init();
