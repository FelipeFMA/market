const script = (() => {
    let items = ["Apple", "Banana", "Red meat", "Chicken", "Cucumber", "Carrot"];
    let prices = [6.71, 1.11, 8.0, 6.0, 16.50, 2.87];
    let orderList = [];
    let total = 0;

    // DOM Elements
    const themeToggleButton = document.getElementById("theme-toggle");
    const productList = document.getElementById("product-list");
    const orderListElement = document.getElementById("order-list");
    const totalElement = document.getElementById("total");
    const successScreen = document.getElementById("success-screen");


    // Theme toggle logic (Improved)
    const currentTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(currentTheme);
    updateTheme(); // Initial theme application

    themeToggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        document.body.classList.toggle("light");
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
        updateTheme();
    });
    function updateTheme() {
        themeToggleButton.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
        const themeClass = document.body.classList.contains("dark") ? "dark" : "light";
        document.querySelectorAll('#product-list, #order-list, input, button').forEach(element => {
            element.classList.remove("dark", "light");
            element.classList.add(themeClass);
        });
    }
    function loadCustomerView() {
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
        const searchInput = document.getElementById("search-customer");
        searchInput.addEventListener("input", () => filterItems(searchInput.value, productList));

        updateOrderList();
    }
    function updateOrderList() {

        orderListElement.innerHTML = "";
        total = 0;
        orderList.forEach(index => {
            const listItem = document.createElement("li");
            listItem.textContent = `${items[index]} - $${prices[index].toFixed(2)}`;
            orderListElement.appendChild(listItem);
            total += prices[index];
        });
        totalElement.textContent = `${total.toFixed(2)}`;
    }
    function filterItems(searchTerm, listElement) {
        const listItems = listElement.querySelectorAll("li");
        listItems.forEach(item => {
            const itemName = item.textContent.toLowerCase();
            if (itemName.includes(searchTerm.toLowerCase())) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }
    function checkout() {
        const successMessage = document.getElementById("success-message");
        successScreen.style.display = "block";
        successMessage.style.display = "block";

        setTimeout(() => {
            orderList = [];
            document.getElementById("order-list").innerHTML = "";
            document.getElementById("total").textContent = "0.00";
        }, 2000);
    }
    function backToShopping() {
        successScreen.style.display = "none";
        orderList = [];
        updateOrderList();
        loadCustomerView();
    }
    document.getElementById("checkout").addEventListener("click", checkout);
    document.getElementById("back-to-shopping").addEventListener("click", backToShopping);

    return {
        loadCustomerView,
    };
})();

script.loadCustomerView();
