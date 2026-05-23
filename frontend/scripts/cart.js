let cart = JSON.parse(localStorage.getItem("cart")) || [];

const elements = {
    cartContainer: document.getElementById("cart-items"),
    subtotalElement: document.getElementById("subtotal"),
    taxElement: document.getElementById("tax"),
    totalElement: document.getElementById("total"),
    checkoutShipping: document.getElementById("checkout-shipping"),
    addToCartBtn: document.getElementById("add-to-cart-btn"),
    buyNowBtn: document.getElementById("buy-now-btn")
};

// RENDER CART (Backend Integration)
async function renderCart() {
    if (!elements.cartContainer) return;
    elements.cartContainer.innerHTML = "";

    if(cart.length === 0) {
        elements.cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add products to continue shopping.</p>
                <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;

        elements.subtotalElement.innerText = "₹0";
        elements.taxElement.innerText = "₹0";
        elements.totalElement.innerText = "₹0";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const price =
            parseFloat(item.price) || 0;
        subtotal += price * item.qty;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Price: ₹${price}</p>
                <div class="cart-qty-controls">
                    <button data-index="${index}" class="decrease-qty">-</button>
                    <span>${item.qty}</span>
                    <button data-index="${index}" class="increase-qty">+</button>
                </div>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        const moveBtn = document.createElement("button");
        moveBtn.classList.add("move-wishlist-btn");
        moveBtn.innerText = "Move to Wishlist";
        moveBtn.dataset.index = index;
        moveBtn.addEventListener("click", () => {
            const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            const exists = wishlist.find(
                item =>
                    item.id === cart[index].id &&
                    item.color === cart[index].color &&
                    item.size === cart[index].size
            );

            if(!exists){
                wishlist.push(cart[index]);
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            cart.splice(index, 1);
            saveCart();
            renderCart();

            notify("Moved to wishlist ❤️", "success");
        });
        cartItem.querySelector(".cart-item-info").appendChild(moveBtn);
        elements.cartContainer.appendChild(cartItem);
    });

    const tax = subtotal * 0.18;
    // CALCULATE SHIPPING
    let shippingCost = 0;
    if(subtotal < 999 && subtotal > 0){
        shippingCost = 49; // flat shipping fee below ₹999
    }
    localStorage.setItem("shippingCost", shippingCost);
    const total = subtotal + tax + shippingCost;

    if(elements.subtotalElement){
        elements.subtotalElement.innerText = `₹${subtotal}`;
    }
    if(elements.taxElement){
        elements.taxElement.innerText = `₹${tax.toFixed(2)}`;
    }
    
    if(elements.checkoutShipping){
        elements.checkoutShipping.innerText = shippingCost === 0 ? "Free" : `₹${shippingCost}`;
    }
    
    if(elements.totalElement){
        elements.totalElement.innerText =
            `₹${total.toFixed(2)}`;
    }

    attachCartEventListeners();
}

// CART EVENT LISTENERS
function attachCartEventListeners() {
    document.querySelectorAll(".increase-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            cart[index].qty++;
            saveCart();
            renderCart();
        });
    });

    document.querySelectorAll(".decrease-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            if (cart[index].qty > 1) {
                cart[index].qty--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            renderCart();
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            cart.splice(index, 1);
            saveCart();
            renderCart();
        });
    });
}

// ADD TO CART FROM PRODUCT CARD / PRODUCT PAGE
async function addToCartFromProduct(product) {
    const item = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        img: product.img || product.image,
        color: product.color,
        size: product.size,
        qty: product.qty || 1
    };

    // STANDARDIZED CART DUPLICATE CHECK
    const existingIndex = cart.findIndex(p => p.id === item.id && p.color === item.color && p.size === item.size);
    if(existingIndex >= 0){
        cart[existingIndex].qty += item.qty;
    } else {
        cart.push(item);
    }

    saveCart();
    notify("Added to cart 🛍️", "success");

    // Optional: POST to backend for logged-in users
    const token = localStorage.getItem("token");
    if(token){
        try{
            const res = await fetch(`${API_BASE}/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(item)
            });
            const data = await res.json();
            if(data.message === "Token expired"){
                await refreshTokenAndRetry(() => addToCartFromProduct(product));
            }
        } catch(err){
            console.error("Error adding item to backend cart:", err);
        }
    }

    // Update cart totals if cart page is open
    if(elements.cartContainer){
        renderCart();
    }
}

// SAVE CART
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

// REFRESH TOKEN HELPER
async function refreshTokenAndRetry(callback){
    const refreshToken = localStorage.getItem("refreshToken");
    if(!refreshToken) return;

    try {
        const res = await fetch(`${API_BASE}/auth/refresh-token`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({refreshToken})
        });
        const data = await res.json();
        if(data.accessToken){
            localStorage.setItem("token", data.accessToken);
            await callback(); // retry original request
        }
    } catch(err){
        console.error("Error refreshing token:", err);
    }
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    if(elements.cartContainer){
        renderCart();
    }
});