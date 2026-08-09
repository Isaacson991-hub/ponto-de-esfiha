// Dados do Cardápio
const menu = [
  { id: 1, cat: "Esfihas", name: "Esfiha de Carne", desc: "Recheio tradicional de carne temperada.", price: 6.50 },
  { id: 2, cat: "Esfihas", name: "Esfiha de Queijo", desc: "Queijo cremoso em massa assada.", price: 6.50 },
  { id: 3, cat: "Esfihas", name: "Esfiha de Frango", desc: "Frango temperado com recheio cremoso.", price: 7.00 },
  { id: 4, cat: "Esfihas", name: "Esfiha de Calabresa", desc: "Calabresa com queijo e temperos.", price: 7.50 },
  { id: 5, cat: "Esfihas", name: "Esfiha de Pizza", desc: "Queijo, tomate e orégano.", price: 7.50 },
  { id: 6, cat: "Esfihas", name: "Esfiha Especial", desc: "Combinação especial da casa.", price: 9.00 },
  { id: 7, cat: "Pizzas", name: "Pizza Calabresa", desc: "Calabresa, cebola e queijo.", price: 45.00 },
  { id: 8, cat: "Pizzas", name: "Pizza Mussarela", desc: "Mussarela, tomate e orégano.", price: 43.00 },
  { id: 9, cat: "Pizzas", name: "Pizza Frango com Catupiry", desc: "Frango desfiado, queijo e creme.", price: 49.00 },
  { id: 10, cat: "Lanches", name: "X-Salada", desc: "Hambúrguer, queijo, salada e molho.", price: 22.00 },
  { id: 11, cat: "Lanches", name: "X-Bacon", desc: "Hambúrguer, queijo, bacon e salada.", price: 25.00 },
  { id: 12, cat: "Lanches", name: "Misto Quente", desc: "Presunto e queijo no pão.", price: 12.00 },
  { id: 13, cat: "Bebidas", name: "Refrigerante lata", desc: "Escolha o sabor disponível.", price: 6.00 },
  { id: 14, cat: "Bebidas", name: "Suco Natural", desc: "Suco gelado para acompanhar.", price: 8.00 },
  { id: 15, cat: "Bebidas", name: "Água Mineral", desc: "Sem gás ou com gás.", price: 4.00 }
];

// Estado da Aplicação
let currentCategory = "Todos";
let cart = [];

// Elementos DOM
const menuEl = document.querySelector("#menu");
const catsEl = document.querySelector("#categories");
const searchInput = document.querySelector("#search");
const cartDrawer = document.querySelector("#cart");
const backdrop = document.querySelector("#backdrop");
const navContainer = document.querySelector("#navContainer");

// Formatador Monetário
const formatMoney = (val) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Renderiza os Botões de Categoria
function renderCategories() {
  const categories = ["Todos", ...new Set(menu.map((x) => x.cat))];
  catsEl.innerHTML = categories
    .map(
      (cat) => `
    <button 
      class="cat ${cat === currentCategory ? "active" : ""}" 
      onclick="setCategory('${cat}')"
      role="tab"
      aria-selected="${cat === currentCategory}">
      ${cat}
    </button>`
    )
    .join("");
}

// Renderiza a Lista de Produtos
function renderMenu() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = menu.filter((item) => {
    const matchesCat = currentCategory === "Todos" || item.cat === currentCategory;
    const matchesQuery = `${item.name} ${item.desc}`.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    menuEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px 0;">Nenhum item encontrado.</p>`;
    return;
  }

  menuEl.innerHTML = filtered
    .map(
      (item) => `
    <article class="item">
      <div class="item-top">
        <h3>${item.name}</h3>
        <span aria-hidden="true">🥙</span>
      </div>
      <p>${item.desc}</p>
      <div class="item-footer">
        <span class="price">${formatMoney(item.price)}</span>
        <button class="add" onclick="addToCart(${item.id})">+ Adicionar</button>
      </div>
    </article>`
    )
    .join("");
}

// Atualiza a Categoria Selecionada
function setCategory(cat) {
  currentCategory = cat;
  renderCategories();
  renderMenu();
}

// Adiciona Item ao Carrinho (Agrupando repetidos)
function addToCart(id) {
  const item = menu.find((product) => product.id === id);
  if (!item) return;

  const existingItem = cart.find((cartItem) => cartItem.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  toggleCart(true);
}

// Altera a Quantidade de um Item
function changeQty(id, delta) {
  const cartItem = cart.find((item) => item.id === id);
  if (!cartItem) return;

  cartItem.qty += delta;

  if (cartItem.qty <= 0) {
    cart = cart.filter((item) => item.id !== id);
  }

  updateCartUI();
}

// Atualiza a Interface do Carrinho
function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  document.querySelector("#cartCount").textContent = totalCount;
  document.querySelector("#total").textContent = formatMoney(totalPrice);

  const cartBody = document.querySelector("#cartItems");

  if (cart.length === 0) {
    cartBody.innerHTML = `<p style='text-align: center; color: var(--muted); margin-top: 40px;'>Seu pedido está vazio.</p>`;
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <small>${formatMoney(item.price)} un.</small>
      </div>
      <div class="cart-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>`
    )
    .join("");
}

// Alterna Exibição do Carrinho
function toggleCart(show) {
  if (show) {
    cartDrawer.classList.add("open");
    backdrop.classList.add("active");
  } else {
    cartDrawer.classList.remove("open");
    backdrop.classList.remove("active");
  }
}

// Finaliza o Pedido enviando para o WhatsApp
function checkout() {
  if (cart.length === 0) {
    alert("Adicione pelo menos um item ao seu pedido!");
    return;
  }

  const itemsList = cart.map((x) => `• ${x.qty}x ${x.name} — ${formatMoney(x.price * x.qty)}`).join("%0A");
  const total = formatMoney(cart.reduce((a, b) => a + b.price * b.qty, 0));

  const text = `Olá, Ponto da Esfiha Itapevi! Gostaria de fazer o pedido:%0A%0A${itemsList}%0A%0A*Total: ${total}*`;

  window.open(`https://wa.me/551141424258?text=${text}`, "_blank");
}

// Event Listeners
document.querySelector("#openCart").addEventListener("click", () => toggleCart(true));
document.querySelector("#closeCart").addEventListener("click", () => toggleCart(false));
document.querySelector("#backdrop").addEventListener("click", () => {
  toggleCart(false);
  navContainer.classList.remove("open");
});

document.querySelector("#checkout").addEventListener("click", checkout);

document.querySelector("#menuToggle").addEventListener("click", () => {
  navContainer.classList.toggle("open");
});

searchInput.addEventListener("input", renderMenu);

// Inicialização
renderCategories();
renderMenu();
updateCartUI();
