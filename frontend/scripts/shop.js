// SHOP PAGE INITIALIZED
// Shared helpers are now provided globally from utils.js
// PRODUCTS ARRAY
let allProducts = [];

// ELEMENTS
const elements = {
    searchInput: document.getElementById("search-input"),
    filterButtons: document.querySelectorAll(".filter-btn"),
    sortSelect: document.getElementById("sort-select"),
    productContainer: document.getElementById("product-container")
};

// FETCH PRODUCTS FROM BACKEND
async function fetchProducts() {
    try {
        if(elements.productContainer){
            elements.productContainer.innerHTML =
                "<h3>Loading products...</h3>";
        }
        const data = await apiRequest("/products");
        if(data.success) {
            allProducts = data.products;
            renderProducts(allProducts);
        } else {
            if (elements.productContainer) {
                elements.productContainer.innerHTML =
                    `<h3>${data.message}</h3>`;
            }
        }
    } catch(error) {
        console.error(error);
        if (elements.productContainer) {
            elements.productContainer.innerHTML =
                `<h3>Failed to load products.</h3>`;
        }
    }
}

function renderStars(rating = 5){
    return Array.from(
        { length: rating },
        () => `<i class="fas fa-star"></i>`
    ).join("");
}

// RENDER PRODUCTS
function renderProducts(products) {
    if (!elements.productContainer) {
        return;
    }
    elements.productContainer.innerHTML = "";
    if(!Array.isArray(products) || products.length === 0){
        elements.productContainer.innerHTML =
            `<h3>No products found.</h3>`;    
        return;
    }

    products.forEach((product, idx) => {
        const productCard = document.createElement("div");
        productCard.classList.add("pro");

        const displayName = product.name || "Product";

        productCard.innerHTML = `
            <img src="${product.image || `../assets/images/f${(idx%4)+1}.jpg`}" alt="${displayName}">
            <div class="des">
                <span>${product.category || 'Brand'}</span>
                <h5>${displayName}</h5>
                <div class="star">
                    ${renderStars(
                        Math.min(
                            Math.max(Number(product.rating) || 5, 1),
                            5
                        )
                    )}
                </div>
                <h4>₹${product.price}</h4>
                <p class="stock-info">${product.stock > 0 ? `Stock: ${product.stock}` : 'Out Of Stock'}</p>
            </div>
            ${product.stock === 0
                ? `<button class="out-stock-btn">Out Of Stock</button>`
                : `<button class="add-to-cart-icon"><i class="fal fa-shopping-cart cart"></i></button>`}
        `;

        // Navigate to product page
        productCard.addEventListener("click", () => {
            setJSON("selectedProduct", product);
            window.location.href = "product.html";
        });

        // Add to cart click handler
        const cartBtn = productCard.querySelector(".add-to-cart-icon");
        if(cartBtn){
            cartBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const item = {
                    id: product.id,
                    name: displayName,
                    price: parseFloat(product.price) || 0,
                    img: product.image || `../assets/images/f${(idx%4)+1}.jpg`,
                    qty: 1
                };

                // Call centralized cart function if exists
                if(typeof addToCartFromProduct === "function"){
                    await addToCartFromProduct(item);
                } else {
                    let cart = getJSON("cart") || [];
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
                }
            });
        }
        elements.productContainer.appendChild(productCard);
    });
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    // SEARCH FILTER
    if (elements.searchInput) {
        elements.searchInput.addEventListener("keyup", () => {
            const value =
                elements.searchInput.value.trim().toLowerCase();
            const filtered =
                allProducts.filter((product) =>
                    (product.name || "")
                        .toLowerCase()
                        .includes(value)
                );
            renderProducts(filtered);
        });
    }

    // CATEGORY FILTER
    elements.filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            elements.filterButtons.forEach((btn) =>
                btn.classList.remove(
                    "active-filter"
                )
            );

            button.classList.add(
                "active-filter"
            );

            const category =
                button.dataset.category;

            if(category === "all"){
                renderProducts(allProducts);
                return;
            }

            const filtered =
                allProducts.filter(
                    (product) =>
                        (product.category || "")
                            .toLowerCase() === category
                );

            renderProducts(filtered);
        });
    });

    // SORT PRODUCTS
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener(
            "change",
            () => {
                let sortedProducts =
                    [...allProducts];

                if (
                    elements.sortSelect.value ===
                    "low-high"
                ) {
                    sortedProducts.sort(
                        (a, b) =>
                            Number(a.price) - Number(b.price)
                    );
                }

                if (
                    elements.sortSelect.value ===
                    "high-low"
                ) {
                    sortedProducts.sort(
                        (a, b) =>
                            Number(b.price) - Number(a.price)
                    );
                }

                renderProducts(
                    sortedProducts
                );
            }
        );
    }
});