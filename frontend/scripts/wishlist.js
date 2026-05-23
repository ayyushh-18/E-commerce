// WISHLIST PAGE INITIALIZED
// Shared helpers are now provided globally from utils.js
let wishlist = getJSON("wishlist") || [];
let cart = getJSON("cart") || [];

// ELEMENTS
const elements = {
    wishlistContainer: document.getElementById("wishlist-container"),
    emptyWishlist: document.getElementById("empty-wishlist")
};

// RENDER WISHLIST
function renderWishlist() {
    if (!elements.wishlistContainer) return;
    elements.wishlistContainer.innerHTML = "";

    if (!Array.isArray(wishlist) || wishlist.length === 0) {
        if (elements.emptyWishlist) {
            elements.emptyWishlist.style.display =
                "block";
        }
        return;
    }

    if (elements.emptyWishlist) {
        elements.emptyWishlist.style.display =
            "none";
    }

    wishlist.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("wishlist-card");
        card.innerHTML = `
            <img
                src="${product.image || 'images/default-product.png'}"
                alt="${product.name || 'Product'}"
            >
            <div class="wishlist-content">
                <span>${product.brand || "Brand"}</span>
                <h4>
                    ${product.name || "Product"}
                </h4>
                <p class="wishlist-price">
                    ₹${parseFloat(
                        product.price || 0
                    ).toFixed(2)}
                </p>
                <div class="wishlist-buttons">
                    <button class="add-cart-btn" data-index="${index}">
                        <i class="fas fa-shopping-cart"></i> Add To Cart
                    </button>
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
            </div>
        `;

        // Navigate to product page
        const productInfo = card.querySelector("img, h4");
        if(productInfo){
            productInfo.addEventListener("click", () => {
                setJSON("selectedProduct", product);
                window.location.href = "product.html";
            });
        }
        elements.wishlistContainer.appendChild(card);
    });
    attachWishlistEventListeners();
}

// WISHLIST EVENT LISTENERS
function attachWishlistEventListeners() {
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const button =
                e.target.closest("button");

            if (!button) return;

            const index =
                parseInt(
                    button.dataset.index
                );
            await addToCartFromWishlist(index);
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const button =
                e.target.closest("button");

            if (!button) return;

            const index =
                parseInt(
                    button.dataset.index
                );
            await removeWishlist(index);
        });
    });
}

// REMOVE WISHLIST ITEM
async function removeWishlist(index) {
    if (!wishlist[index]) return;
    const product =
        wishlist[index];
    wishlist.splice(index, 1);
    setJSON("wishlist", wishlist);
    renderWishlist();

    const token = localStorage.getItem("token");
    if(token){
        try{
            const data = await apiRequest("/wishlist/remove", {
                method: "POST",
                body: JSON.stringify({
                    productId: product.id
                })
            });
            if(!data.success){
                console.warn(
                    "Backend wishlist remove failed:",
                    data.message
                );
            }
        } catch(err){
            console.error("Error removing wishlist item:", err);
        }
    }
}

// ADD TO CART FROM WISHLIST
async function addToCartFromWishlist(index) {
    if (!wishlist[index]) return;
    const product =
        wishlist[index];

    const item = {
        id: product.id,
        name: product.name,
        price:
            parseFloat(product.price) || 0,
        img: product.image,
        qty: 1
    };

    const existingIndex = cart.findIndex(
        p => p.id === item.id
    );

    if(existingIndex >= 0){
        cart[existingIndex].qty += 1;
    } else {
        cart.push(item);
    }

    setJSON("cart", cart);
    notify(
        "Added to cart 🛍️",
        "success"
    );

    // POST to backend if logged in
    const token = localStorage.getItem("token");
    if(token){
        try{
            const data = await apiRequest("/cart/add", {
                method: "POST",
                body: JSON.stringify(item)
            });
            if(!data.success){
                console.warn(
                    "Backend cart add failed:",
                    data.message
                );
            }
        } catch(err){
            console.error("Error adding item to cart:", err);
        }
    }
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
});