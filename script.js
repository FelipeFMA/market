let items = ["Apple", "Banana", "Red meat", "Chicken", "Cucumber", "Carrot"];
let prices = [6.71, 1.11, 8.0, 6.0, 16.50, 2.87];
let orderList = [];
const adminPassword = "Root123";
let total = 0;

function loadCustomerView() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    items.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item} - $${prices[index].toFixed(2)}`;
        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.addEventListener("click", () => {
            orderList.push(index);
            updateOrderList();
        });
        listItem.appendChild(addButton);
        productList.appendChild(listItem);
    });
    updateOrderList();
}

function updateOrderList() {
    const orderListElement = document.getElementById("order-list");
    const totalElement = document.getElementById("total");
    orderListElement.innerHTML = "";
    total = 0;
    orderList.forEach(index => {
        const listItem = document.createElement("li");
        listItem.textContent = `${items[index]} - R${prices[index].toFixed(2)}`;
        orderListElement.appendChild(listItem);
        total += prices[index];
    });
    totalElement.textContent = total.toFixed(2);
}

function loadAdminView() {
    const adminPanel = document.getElementById("admin-panel");
    const adminActions = document.getElementById("admin-actions");
    const passwordInput = document.getElementById("admin-password");
    const loginButton = document.getElementById("login-admin");
    const addItemButton = document.getElementById("add-item");
    const removeItemButton = document.getElementById("remove-item");
    const adminItemList = document.getElementById("admin-item-list");

    loginButton.addEventListener("click", () => {
        if (passwordInput.value === adminPassword) {
            adminPanel.style.display = "none";
            adminActions.style.display = "block";
            listItems();
        } else {
            alert("Incorrect password!");
        }
    });

    addItemButton.addEventListener("click", () => {
        const name = document.getElementById("add-item-name").value;
        const price = parseFloat(document.getElementById("add-item-price").value);
        if (name && !isNaN(price)) {
            items.push(name);
            prices.push(price);
            alert("Item added!");
            listItems();
        } else {
            alert("Please enter a valid name and price.");
        }
    });

    removeItemButton.addEventListener("click", () => {
        const name = document.getElementById("remove-item-name").value;
        const index = items.indexOf(name);
        if (index !== -1) {
            items.splice(index, 1);
            prices.splice(index, 1);
            alert("Item removed!");
            listItems();
        } else {
            alert("Item not found!");
        }
    });

    function listItems() {
        adminItemList.innerHTML = "";
        items.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item} - R${prices[index].toFixed(2)}`;
            adminItemList.appendChild(listItem);
        });
    }
}

document.getElementById("checkout").addEventListener("click", () => {
    const successScreen = document.getElementById("success-screen");
    const successMessage = document.getElementById("success-message");

    successScreen.style.display = "block";
    successMessage.style.display = "block";

    setTimeout(() => {
        orderList = [];
        document.getElementById("order-list").innerHTML = "";
        document.getElementById("total").textContent = "0.00";
    }, 2000);
});

document.getElementById("back-to-shopping").addEventListener("click", () => {
    const successScreen = document.getElementById("success-screen");
    successScreen.style.display = "none";
    orderList = [];
    updateOrderList();
    loadCustomerView();
});