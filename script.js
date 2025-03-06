let items = ["Maça", "Banana", "Carne vermelha ", "Frango", "Pepino", "Cenoura"]; // Lista de itens disponíveis
let prices = [6.71, 1.11, 8.0, 6.0, 16.50, 2.87]; // Preços correspondentes aos itens
let orderList = []; // Lista de itens no carrinho
const adminPassword = "Root123"; // Senha do administrador
let total = 0; // Total da compra

// Função para carregar a visualização do cliente
function loadCustomerView() {
    const productList = document.getElementById("product-list"); // Obtém a lista de produtos
    productList.innerHTML = ""; // Limpa a lista de produtos
    items.forEach((item, index) => {
        const listItem = document.createElement("li"); // Cria um item de lista
        listItem.textContent = `${item} - R${prices[index].toFixed(2)}`; // Define o texto do item
        const addButton = document.createElement("button"); // Cria um botão para adicionar o item
        addButton.textContent = "Adicionar"; // Define o texto do botão
        addButton.addEventListener("click", () => {
            orderList.push(index); // Adiciona o índice do item ao carrinho
            updateOrderList(); // Atualiza a lista de pedidos
        });
        listItem.appendChild(addButton); // Adiciona o botão ao item da lista
        productList.appendChild(listItem); // Adiciona o item da lista à lista de produtos
    });
    updateOrderList(); // Atualiza a lista de pedidos inicialmente
}

// Função para atualizar a lista de pedidos e o total
function updateOrderList() {
    const orderListElement = document.getElementById("order-list"); // Obtém a lista de pedidos
    const totalElement = document.getElementById("total"); // Obtém o elemento do total
    orderListElement.innerHTML = ""; // Limpa a lista de pedidos
    total = 0; // Reseta o total
    orderList.forEach(index => {
        const listItem = document.createElement("li"); // Cria um item de lista para o pedido
        listItem.textContent = `${items[index]} - R${prices[index].toFixed(2)}`; // Define o texto do item do pedido
        orderListElement.appendChild(listItem); // Adiciona o item à lista de pedidos
        total += prices[index]; // Adiciona o preço do item ao total
    });
    totalElement.textContent = total.toFixed(2); // Atualiza o total exibido
}

// Função para carregar a visualização do administrador
function loadAdminView() {
    const adminPanel = document.getElementById("admin-panel"); // Obtém o painel administrativo
    const adminActions = document.getElementById("admin-actions"); // Obtém as ações administrativas
    const passwordInput = document.getElementById("admin-password"); // Obtém o campo de senha
    const loginButton = document.getElementById("login-admin"); // Obtém o botão de login
    const addItemButton = document.getElementById("add-item"); // Obtém o botão de adicionar item
    const removeItemButton = document.getElementById("remove-item"); // Obtém o botão de remover item
    const listItemsButton = document.getElementById("list-items"); // Obtém o botão de listar itens
    const adminItemList = document.getElementById("admin-item-list"); // Obtém a lista de itens do admin

    // Evento de clique para o botão de login
    loginButton.addEventListener("click", () => {
        if (passwordInput.value === adminPassword) { // Verifica se a senha está correta
            adminPanel.style.display = "none"; // Esconde o painel administrativo
            adminActions.style.display = "block"; // Mostra as ações administrativas
            listItemsButton.click(); // Lista os itens ao fazer login
        } else {
            alert("Senha incorreta!"); // Alerta se a senha estiver incorreta
        }
    });

    // Evento de clique para o botão de adicionar item
    addItemButton.addEventListener("click", () => {
        const name = document.getElementById("add-item-name").value; // Obtém o nome do item
        const price = parseFloat(document.getElementById("add-item-price").value); // Obtém o preço do item
        if (name && !isNaN(price)) { // Verifica se o nome e o preço são válidos
            items.push(name); // Adiciona o item à lista
            prices.push(price); // Adiciona o preço à lista
            alert("Item adicionado!"); // Alerta que o item foi adicionado
            listItemsButton.click(); // Atualiza a lista de itens
        } else {
            alert("Por favor, insira um nome e um preço válidos."); // Alerta se os dados forem inválidos
        }
    });

    // Evento de clique para o botão de remover item
    removeItemButton.addEventListener("click", () => {
        const name = document.getElementById("remove-item-name").value; // Obtém o nome do item a ser removido
        const index = items.indexOf(name); // Obtém o índice do item na lista
        if (index !== -1) { // Verifica se o item existe
            items.splice(index, 1); // Remove o item da lista
            prices.splice(index, 1); // Remove o preço correspondente
            alert("Item removido!"); // Alerta que o item foi removido
            listItemsButton.click(); // Atualiza a lista de itens
        } else {
            alert("Item não encontrado!"); // Alerta se o item não for encontrado
        }
    });

    // Evento de clique para o botão de listar itens
    listItemsButton.addEventListener("click", () => {
        adminItemList.innerHTML = ""; // Limpa a lista de itens do admin
        items.forEach((item, index) => {
            const listItem = document.createElement("li"); // Cria um item de lista
            listItem.textContent = `${item} - R${prices[index].toFixed(2)}`; // Define o texto do item
            adminItemList.appendChild(listItem); // Adiciona o item à lista de itens do admin
        });
    });
}

// Adiciona a funcionalidade de finalizar compra
document.getElementById("checkout").addEventListener("click", () => {
    const successScreen = document.getElementById("success-screen"); // Obtém a tela de sucesso
    const successMessage = document.getElementById("success-message"); // Obtém a mensagem de sucesso

    // Mostrar a tela de sucesso
    successScreen.style.display = "block"; // Exibe a tela de sucesso
    successMessage.style.display = "block"; // Exibe a mensagem de sucesso

    // Limpa a lista de pedidos após um pequeno atraso
    setTimeout(() => {
        orderList = []; // Limpa a lista de pedidos
        document.getElementById("order-list").innerHTML = ""; // Limpa a lista de pedidos exibida
        document.getElementById("total").textContent = "0.00"; // Reseta o total exibido
        location.reload(); // Recarrega a página
    }, 2000); // Espera 2 segundos antes de recarregar
});

// Adicionar funcionalidade para voltar às compras
document.getElementById("back-to-shopping").addEventListener("click", () => {
    const successScreen = document.getElementById("success-screen"); // Obtém a tela de sucesso
    successScreen.style.display = "none"; // Esconde a tela de sucesso
    orderList = []; // Limpa a lista de pedidos
    updateOrderList(); // Atualiza a lista de pedidos
    loadCustomerView(); // Recarrega a visualização do cliente
});
