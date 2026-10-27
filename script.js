
const products = [
  {id: 1, name: "Decorative Diyas", category: "Decor", price: 299, emoji: "🪔"},
  {id: 2, name: "Rangoli Decoration Set", category: "Decor", price: 199, emoji: "🌸"},
  {id: 3, name: "Festive Kurta", category: "Clothing", price: 899, emoji: "👘"},
  {id: 4, name: "Fairy Lights", category: "Lights", price: 399, emoji: "✨"},
  {id: 5, name: "Gift Hamper", category: "Gifts", price: 799, emoji: "🎁"},
  {id: 6, name: "Decorative Lantern", category: "Decor", price: 499, emoji: "🏮"},
  {id: 7, name: "Festive Gift Box", category: "Gifts", price: 599, emoji: "🎀"},
  {id: 8, name: "Ethnic Dupatta", category: "Clothing", price: 699, emoji: "🧣"},
  {id: 9, name: "LED Diya Set", category: "Lights", price: 349, emoji: "🕯️"}
];

let cart = [];
let couponApplied = false;

const get = id => document.getElementById(id);
const rupees = amount => amount.toFixed(2);

function displayProducts() {
  let search = get("search").value.toLowerCase();
  let category = get("category").value;
  let sort = get("sort").value;

  let list = products.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (category === "All" || p.category === category)
  );

  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);

  get("productList").innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-art">${p.emoji}</div>
      <div class="product-info">
        <p>${p.category}</p>
        <h3>${p.name}</h3>
        <div class="price">₹${p.price}</div>
        <button class="btn" onclick="addToCart(${p.id})">
          Add to Cart
        </button>
      </div>
    </article>
  `).join("") : "<p>No products found.</p>";
}

function addToCart(id) {
  let item = cart.find(p => p.id === id);
  if (item) item.qty++;
  else cart.push({...products.find(p => p.id === id), qty: 1});
  updateCart();
}

function changeQty(id, amount) {
  let item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) removeItem(id);
  else updateCart();
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  updateCart();
}

function clearCart() {
  cart = [];
  couponApplied = false;
  get("coupon").value = "";
  get("couponMessage").textContent = "";
  updateCart();
}

function applyCoupon() {
  if (get("coupon").value.trim().toUpperCase() === "DIWALI10") {
    couponApplied = true;
    get("couponMessage").textContent = "10% discount applied!";
    get("couponMessage").style.color = "green";
  } else {
    couponApplied = false;
    get("couponMessage").textContent = "Invalid coupon code.";
    get("couponMessage").style.color = "red";
  }
  updateCart();
}

function updateCart() {
  get("cartCount").textContent =
    cart.reduce((sum, p) => sum + p.qty, 0);

  get("cartItems").innerHTML = cart.length ? cart.map(p => `
    <div class="cart-item">
      <div>
        <h4>${p.emoji} ${p.name}</h4>
        <small>₹${p.price} each</small>
        <br><button class="remove" onclick="removeItem(${p.id})">
          Remove
        </button>
      </div>
      <div class="quantity">
        <button onclick="changeQty(${p.id}, -1)">−</button>
        <span>${p.qty}</span>
        <button onclick="changeQty(${p.id}, 1)">+</button>
        <b>₹${p.price * p.qty}</b>
      </div>
    </div>
  `).join("") : "<p>Your cart is empty. Add some festive products!</p>";

  let subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  let discount = couponApplied ? subtotal * 0.10 : 0;
  let delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 49;
  let total = subtotal - discount + delivery;

  get("subtotal").textContent = rupees(subtotal);
  get("discount").textContent = rupees(discount);
  get("delivery").textContent = rupees(delivery);
  get("total").textContent = rupees(total);
  get("checkoutTotal").textContent = rupees(total);
}

function showCheckout() {
  if (!cart.length) {
    alert("Please add products to your cart first!");
    return;
  }

  get("checkout").classList.remove("hidden");
  get("success").classList.add("hidden");
  get("checkout").scrollIntoView({behavior: "smooth"});
}

get("search").addEventListener("input", displayProducts);
get("category").addEventListener("change", displayProducts);
get("sort").addEventListener("change", displayProducts);

get("checkoutForm").addEventListener("submit", function(event) {
  event.preventDefault();

  get("successMessage").textContent =
    "Thank you, " + get("customerName").value +
    "! Your Diwali order has been placed successfully.";

  get("success").classList.remove("hidden");
  get("checkout").classList.add("hidden");
  get("success").scrollIntoView({behavior: "smooth"});

  cart = [];
  couponApplied = false;
  get("coupon").value = "";
  get("couponMessage").textContent = "";
  updateCart();
  this.reset();
});

displayProducts();
updateCart();
