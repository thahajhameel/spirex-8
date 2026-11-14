
const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");
const filter = document.getElementById("filter");
const transactionList = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

date.value = new Date().toISOString().split("T")[0];

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {
    const income = transactions
        .filter(item => item.type === "income")
        .reduce((total, item) => total + item.amount, 0);

    const expense = transactions
        .filter(item => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

    const balance = income - expense;

    document.getElementById("income").textContent = `₹${income.toFixed(2)}`;
    document.getElementById("expense").textContent = `₹${expense.toFixed(2)}`;
    document.getElementById("balance").textContent = `₹${balance.toFixed(2)}`;
}

function displayTransactions() {
    transactionList.innerHTML = "";

    const selectedFilter = filter.value;

    const filteredTransactions = transactions.filter(item =>
        selectedFilter === "all" || item.type === selectedFilter
    );

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = '<li class="empty">No transactions found.</li>';
    }

    filteredTransactions.forEach(item => {
        const li = document.createElement("li");

        const info = document.createElement("div");
        info.className = "transaction-info";

        const name = document.createElement("strong");
        name.textContent = item.description;

        const details = document.createElement("small");
        details.textContent = `${item.category} • ${item.date}`;

        info.appendChild(name);
        info.appendChild(details);

        const value = document.createElement("span");
        value.className = item.type === "income" ? "positive" : "negative";
        value.textContent = `${item.type === "income" ? "+" : "-"}₹${item.amount.toFixed(2)}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteTransaction(item.id));

        li.appendChild(info);
        li.appendChild(value);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);
    });

    updateSummary();
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const transaction = {
        id: Date.now(),
        description: description.value.trim(),
        amount: Number(amount.value),
        type: type.value,
        category: category.value,
        date: date.value
    };

    if (!transaction.description || !Number.isFinite(transaction.amount) ||
        transaction.amount <= 0 || !transaction.date) {
        alert("Please enter valid transaction details.");
        return;
    }

    transactions.push(transaction);

    saveTransactions();
    displayTransactions();

    form.reset();
    date.value = new Date().toISOString().split("T")[0];
});

function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);

    saveTransactions();
    displayTransactions();
}

filter.addEventListener("change", displayTransactions);

displayTransactions();
