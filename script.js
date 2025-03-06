const script = (() => {
    let items = ["Apple", "Banana", "Red meat", "Chicken", "Cucumber", "Carrot"];
    let prices = [6.71, 1.11, 8.0, 6.0, 16.50, 2.87];
    let orderList = [];
    const adminPassword = "Root123";
    let total = 0;

    // DOM Elements
    const themeToggleButton = document.getElementById("theme-toggle");
    const productList = document.getElementById("product-list");
    const orderListElement = document.getElementById("order-list");
    const totalElement = document.getElementById("total");
    const adminPanel = document.getElementById("admin-panel");
    const adminActions = document.getElementById("admin-actions");
    const adminItemList = document.getElementById("admin-item-list");
    const successScreen = document.getElementById("success-screen");

    // Theme toggle logic
    const currentTheme = localStorage.getItem("theme") || "dark"; // Default to dark theme
    document.body.classList.add(currentTheme);

    themeToggleButton.addEventListener("click", () => {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
            localStorage.setItem("theme", "light");
            themeToggleButton.textContent = "🌙"; // Moon icon for light mode

            // Update classes for relevant elements
            document.querySelectorAll('#product-list, #order-list, #admin-item-list, #admin-panel, #admin-actions, input[type="text"], input[type="number"], input[type="password"]').forEach(element => {
                element.classList.remove("dark");
                element.classList.add("light");
            });
        } else {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
            themeToggleButton.textContent = "☀️"; // Sun icon for dark mode

            // Update classes for relevant elements
            document.querySelectorAll('#product-list, #order-list, #admin-item-list, #admin-panel, #admin-actions, input[type="text"], input[type="number"], input[type="password"]').forEach(element => {
                element.classList.remove("light");
                element.classList.add("dark");
            });
        }
    });
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
    function loadAdminView() {
        const passwordInput = document.getElementById("admin-password");
        const loginButton = document.getElementById("login-admin");
        const addItemButton = document.getElementById("add-item");

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

        const removeItemButton = document.getElementById("remove-item");
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
                listItem.textContent = `${item} - $${prices[index].toFixed(2)}`;
                adminItemList.appendChild(listItem);
            });
        }
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
        loadAdminView,
    };
})();

script.loadCustomerView();
script.loadAdminView();
