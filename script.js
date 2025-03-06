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
  const backToMainButton = document.getElementById("back-to-main");

  // Adicione o event listener para o botão Back to Main
  if (backToMainButton) {
    backToMainButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

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

      // Verifica qual view deve ser carregada
      if (window.location.pathname.includes("customer.html")) {
        loadCustomerView();
      } else if (window.location.pathname.includes("admin.html")) {
        loadAdminView();
      }
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
      if (window.location.pathname.includes("customer.html")) {
        loadCustomerView();
      } else if (window.location.pathname.includes("admin.html")) {
        loadAdminView();
      }
    }
  }

  // Theme toggle logic
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.add(currentTheme);
  updateTheme();

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      document.body.classList.toggle("light");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light",
      );
      updateTheme();
    });
  }

  function updateTheme() {
    if (themeToggleButton) {
      themeToggleButton.textContent = document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";
    }
    const themeClass = document.body.classList.contains("dark")
      ? "dark"
      : "light";
    document
      .querySelectorAll(
        "#product-list, #order-list, input, button, #admin-panel, #admin-item-list",
      )
      .forEach((element) => {
        element.classList.remove("dark", "light");
        element.classList.add(themeClass);
      });
  }

  // Customer View Functions
  function loadCustomerView() {
    console.log("Loading customer view with items:", marketItems);
    if (!productList) return;

    productList.innerHTML = "";
    marketItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
      const addButton = document.createElement("button");
      addButton.textContent = "Add";
      addButton.addEventListener("click", () => {
        orderList.push(item);
        updateOrderList();
        showFeedback("Item added to cart!");
      });
      listItem.appendChild(addButton);
      productList.appendChild(listItem);
    });

    const searchInput = document.getElementById("search-customer");
    if (searchInput) {
      searchInput.addEventListener("input", () =>
        filterItems(searchInput.value, productList),
      );
    }

    updateOrderList();
  }

  function updateOrderList() {
    if (!orderListElement) return;

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
      orderList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                    ${item.name} - $${item.price.toFixed(2)}
                    <button onclick="script.removeFromCart(${index})" style="background-color: #f44336;">Remove</button>
                `;
        orderListElement.appendChild(listItem);
        total += item.price;
      });
    }

    if (totalElement) {
      totalElement.textContent = total.toFixed(2);
    }
  }

  // Admin View Functions
  function loadAdminView() {
    const itemsList = document.getElementById("items-list");
    const addItemButton = document.getElementById("add-item");
    const updateItemButton = document.getElementById("update-item");
    const cancelEditButton = document.getElementById("cancel-edit");
    let selectedItemId = null;

    function refreshItemsList() {
      if (!itemsList) return;

      itemsList.innerHTML = "";
      marketItems.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${item.name} - $${item.price.toFixed(2)} (${item.category})</span>
                        <div>
                            <button onclick="script.editItem(${item.id})">Edit</button>
                            <button onclick="script.deleteItem(${item.id})" style="background-color: #f44336;">Delete</button>
                        </div>
                    </div>
                `;
        itemsList.appendChild(li);
      });
      updateStats();
    }

    function updateStats() {
      const totalItemsElement = document.getElementById("total-items");
      const totalValueElement = document.getElementById("total-value");

      if (totalItemsElement && totalValueElement) {
        totalItemsElement.textContent = marketItems.length;
        const totalValue = marketItems.reduce(
          (sum, item) => sum + item.price,
          0,
        );
        totalValueElement.textContent = totalValue.toFixed(2);
      }
    }

    if (addItemButton) {
      addItemButton.addEventListener("click", () => {
        const name = document.getElementById("item-name").value;
        const price = parseFloat(document.getElementById("item-price").value);
        const category = document.getElementById("item-category").value;

        if (name && price && category) {
          const newId =
            marketItems.length > 0
              ? Math.max(...marketItems.map((item) => item.id)) + 1
              : 1;

          marketItems.push({
            id: newId,
            name: name,
            price: price,
            category: category,
          });

          refreshItemsList();
          clearForm();
          showFeedback("Item added successfully!");
        }
      });
    }

    function clearForm() {
      const nameInput = document.getElementById("item-name");
      const priceInput = document.getElementById("item-price");
      const categoryInput = document.getElementById("item-category");

      if (nameInput) nameInput.value = "";
      if (priceInput) priceInput.value = "";
      if (categoryInput) categoryInput.value = "";

      if (addItemButton) addItemButton.style.display = "block";
      if (updateItemButton) updateItemButton.style.display = "none";
      if (cancelEditButton) cancelEditButton.style.display = "none";
    }

    // Inicializar a lista
    refreshItemsList();

    // Métodos públicos para o admin
    window.script = {
      ...window.script,
      editItem: (id) => {
        const item = marketItems.find((item) => item.id === id);
        if (item) {
          document.getElementById("item-name").value = item.name;
          document.getElementById("item-price").value = item.price;
          document.getElementById("item-category").value = item.category;
          selectedItemId = id;
          addItemButton.style.display = "none";
          updateItemButton.style.display = "block";
          cancelEditButton.style.display = "block";
        }
      },

      deleteItem: (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
          marketItems = marketItems.filter((item) => item.id !== id);
          refreshItemsList();
          showFeedback("Item deleted successfully!");
        }
      },
    };

    // Update item handler
    if (updateItemButton) {
      updateItemButton.addEventListener("click", () => {
        if (selectedItemId) {
          const itemIndex = marketItems.findIndex(
            (item) => item.id === selectedItemId,
          );
          if (itemIndex !== -1) {
            marketItems[itemIndex] = {
              id: selectedItemId,
              name: document.getElementById("item-name").value,
              price: parseFloat(document.getElementById("item-price").value),
              category: document.getElementById("item-category").value,
            };
            refreshItemsList();
            clearForm();
            selectedItemId = null;
            showFeedback("Item updated successfully!");
          }
        }
      });
    }

    // Search functionality
    const searchInput = document.getElementById("search-admin");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        filterItems(searchInput.value, itemsList);
      });
    }
  }

  // Utility Functions
  function filterItems(searchTerm, listElement) {
    if (!listElement) return;

    const listItems = listElement.querySelectorAll("li");
    listItems.forEach((item) => {
      const itemText = item.textContent.toLowerCase();
      if (itemText.includes(searchTerm.toLowerCase())) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  function showFeedback(message, isError = false) {
    const feedbackEl = document.getElementById("feedback-message");
    if (feedbackEl) {
      feedbackEl.textContent = message;
      feedbackEl.style.backgroundColor = isError ? "#f44336" : "#4caf50";
      feedbackEl.style.display = "block";

      setTimeout(() => {
        feedbackEl.style.display = "none";
      }, 3000);
    }
  }

  function checkout() {
    if (successScreen) {
      successScreen.style.display = "block";
    }
    const successMessage = document.getElementById("success-message");
    if (successMessage) {
      successMessage.style.display = "block";
    }

    setTimeout(() => {
      orderList = [];
      if (orderListElement) {
        orderListElement.innerHTML = "";
      }
      if (totalElement) {
        totalElement.textContent = "0.00";
      }
    }, 2000);
  }

  function backToShopping() {
    if (successScreen) {
      successScreen.style.display = "none";
    }
    orderList = [];
    updateOrderList();
    loadCustomerView();
  }

  // Event Listeners
  const checkoutButton = document.getElementById("checkout");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", checkout);
  }

  const backToShoppingButton = document.getElementById("back-to-shopping");
  if (backToShoppingButton) {
    backToShoppingButton.addEventListener("click", backToShopping);
  }

  // Initialize
  fetchItems();

  // Public methods
  return {
    loadCustomerView,
    loadAdminView,
    fetchItems,
    removeFromCart: (index) => {
      orderList.splice(index, 1);
      updateOrderList();
      showFeedback("Item removed from cart!");
    },
  };
})();
