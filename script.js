const script = (() => {
  let marketItems = [];
  let orderList = [];
  let total = 0;

  // DOM Elements
  const themeToggleButton = document.getElementById("theme-toggle");
  const productList = document.getElementById("product-list");
  const orderListElement = document.getElementById("order-list");
  const totalElement = document.getElementById("total");
  const successScreen = document.getElementById("success-screen");

  // Fetch items from JSON
  async function fetchItems() {
    try {
      console.log("Fetching items...");
      const response = await fetch("./items.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Loaded data:", data);
      marketItems = data.items;
      console.log("Market items:", marketItems);
      loadCustomerView();
    } catch (error) {
      console.error("Error loading items:", error);
      // Fallback to default items if JSON fails to load
      marketItems = [
        { id: 1, name: "Apple", price: 6.71, category: "Fruits" },
        { id: 2, name: "Banana", price: 1.11, category: "Fruits" },
        { id: 3, name: "Red meat", price: 8.0, category: "Meat" },
        { id: 4, name: "Chicken", price: 6.0, category: "Meat" },
        { id: 5, name: "Cucumber", price: 16.5, category: "Vegetables" },
        { id: 6, name: "Carrot", price: 2.87, category: "Vegetables" },
      ];
      loadCustomerView();
    }
  }

  // Theme toggle logic (Improved)
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.add(currentTheme);
  updateTheme();

  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light",
    );
    updateTheme();
  });

  function updateTheme() {
    themeToggleButton.textContent = document.body.classList.contains("dark")
      ? "☀️"
      : "🌙";
    const themeClass = document.body.classList.contains("dark")
      ? "dark"
      : "light";
    document
      .querySelectorAll("#product-list, #order-list, input, button")
      .forEach((element) => {
        element.classList.remove("dark", "light");
        element.classList.add(themeClass);
      });
  }

  function loadCustomerView() {
    console.log("Loading customer view with items:", marketItems);

    productList.innerHTML = "";
    marketItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
      const addButton = document.createElement("button");
      addButton.textContent = "Add";
      addButton.addEventListener("click", () => {
        orderList.push(item);
        updateOrderList();
      });
      listItem.appendChild(addButton);
      productList.appendChild(listItem);
    });

    const searchInput = document.getElementById("search-customer");
    searchInput.addEventListener("input", () =>
      filterItems(searchInput.value, productList),
    );

    updateOrderList();
  }

  function updateOrderList() {
    orderListElement.innerHTML = "";
    total = 0;

    if (orderList.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent =
        "Your cart is empty! Click 'Add' on any product to start shopping.";
      emptyMessage.style.fontStyle = "italic";
      emptyMessage.style.color = "#666";
      orderListElement.appendChild(emptyMessage);
    } else {
      orderList.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        orderListElement.appendChild(listItem);
        total += item.price;
      });
    }

    totalElement.textContent = total.toFixed(2);
  }

  function filterItems(searchTerm, listElement) {
    const listItems = listElement.querySelectorAll("li");
    listItems.forEach((item) => {
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
  document
    .getElementById("back-to-shopping")
    .addEventListener("click", backToShopping);

  // Inicializar o carregamento dos itens
  fetchItems();

  return {
    loadCustomerView,
    fetchItems,
  };
})();
