console.log("Product page loaded successfully!");

// API BASE URL & GLOBAL STATE
const API_BASE = "http://localhost:5000/api";
const notify = (message, type = "info") => {
    if (typeof showToast === "function") {
        showToast(message, type); // calls showToast, not notify()
    } else {
        alert(message);
    }
};

// REPLACE WITH
const elements = {
    mainImage: document.getElementById("main-product-image"),
    smallImages: document.querySelectorAll(".small-image"),
    qtyInput: document.getElementById("product-qty"),
    productCategory: document.getElementById("product-category"),
    productName: document.getElementById("product-name"),
    productPrice: document.getElementById("product-price"),
    productOriginalPrice: document.getElementById("product-original-price"),
    productDiscount: document.getElementById("product-discount"),
    productBrand: document.getElementById("product-brand"),
    productDescription: document.getElementById("product-description"),
    productStock: document.getElementById("product-stock"),
    productRatingText: document.getElementById("product-rating-text"),
    variantStock: document.getElementById("variant-stock"),
    relatedContainer: document.getElementById("related-products-container"),
    recommendedContainer: document.getElementById("recommended-products-container"),
    wishlistBtn: document.getElementById("wishlist-btn"),
    reviewForm: document.getElementById("review-form"),
    reviewContainer: document.getElementById("review-container"),
    plusBtn: document.getElementById("plus-btn"),
    minusBtn: document.getElementById("minus-btn"),
    addToCartBtn: document.getElementById("add-to-cart-btn"),
    buyNowBtn: document.getElementById("buy-now-btn")
};

function renderStars(rating) {
    let stars = "";
    for(let i=0; i<5; i++) {
        stars += i < rating ? `<i class="fas fa-star"></i>` : `<i class="far fa-star"></i>`;
    }
    return stars;
}

function renderProductCard(product, container) {
    const card = document.createElement("div");
    card.classList.add("pro");
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="des">
            <span>${product.brand || "Brand"}</span>
            <h5>${product.name}</h5>
            <div class="star">
                ${renderStars(product.rating || 4)}
            </div>
            <h4>₹${product.price}</h4>
        </div>
    `;
    card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "product.html";
    });
    container.appendChild(card);
}

// Read product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Fetch product from backend
let currentProduct = null;
async function fetchProduct() {
    const res = await apiRequest(`/products/${productId}`);
    if (res.success) {
        currentProduct = res.product;
        renderProduct(currentProduct);
    } else {
        // fallback if backend fails
        currentProduct = {
            id: 1,
            brand: "AnthropicBots",
            name: "Modern Fashion T-Shirt",
            category: "T-Shirt",
            price: 999,
            image: "../assets/images/f1.jpg",
            description: "Premium quality cotton t-shirt with breathable fabric and modern fashion styling.",
            stock: 12,
            rating: 4.5
        };
        renderProduct(currentProduct);
        updateRecentlyViewed(currentProduct);
    }
}
fetchProduct();

// RECENTLY VIEWED PRODUCTS
// AFTER currentProduct is fetched
function updateRecentlyViewed(product) {
    let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    viewed = viewed.filter(item => item.id !== product.id);
    viewed.unshift({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        image: product.image
    });
    viewed = viewed.slice(0, 8);
    localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

if (qtyInput) {
    qtyInput.addEventListener(
        "input",
        () => {
            if(
                qtyInput.value < 1
                ||
                isNaN(qtyInput.value)
            ){
                qtyInput.value = 1;
            }
        }
    );
}

if (productCategory) {
    productCategory.innerText =
        `Home / ${
            currentProduct.category ||
            "Category"
        }`;
}

if (productName) {
    productName.innerText =
        currentProduct.name ||
        "Product";
}

if (productPrice) {
    const discountedPrice = currentProduct.price * (1 - (currentProduct.discount_percent || 0)/100);
    productPrice.innerText = `₹${discountedPrice.toFixed(2)}`;
    if (elements.productOriginalPrice) {
        elements.productOriginalPrice.innerText = `₹${currentProduct.original_price || currentProduct.price}`;
    }
    if (elements.productDiscount) {
        elements.productDiscount.innerText = `${currentProduct.discount_percent || 0}% OFF`;
    }
}

if (productBrand) {
    productBrand.innerText =
        currentProduct.brand ||
        "Brand";
}

if (productDescription) {
    productDescription.innerText =
        currentProduct.description ||
        "Premium quality product.";
}

if (productStock) {
    productStock.innerText =
        currentProduct.stock > 0
            ? `${currentProduct.stock} Available`
            : "Out Of Stock";
}

if (productRatingText) {
    productRatingText.innerText =
        `(${
            currentProduct.rating || 4.5
        } Ratings)`;
}

const ratingContainer =
    document.querySelector(
        ".product-rating"
    );

const rating =
    Math.round(
        currentProduct.rating || 4.5
    );

let starsHTML = "";

for(
    let i = 0;
    i < 5;
    i++
){
    if(i < rating){
        starsHTML += `
            <i class="fas fa-star"></i>
        `;
    }else{
        starsHTML += `
            <i class="far fa-star"></i>
        `;
    }
}

if (ratingContainer) {
    ratingContainer.innerHTML = `
        ${starsHTML}
        <span id="product-rating-text">
            (${currentProduct.rating || 4.5} Ratings)
        </span>
    `;
}

const deliveryDate =
    new Date();

deliveryDate.setDate(
    deliveryDate.getDate() + 4
);

const formattedDelivery =
    deliveryDate.toDateString();

const deliveryElement =
    document.createElement("p");

deliveryElement.classList.add(
    "delivery-date"
);

deliveryElement.innerHTML = `
    <i class="fas fa-truck"></i>
    Delivery by:
    ${formattedDelivery}
`;

const productTopMeta =
    document.querySelector(
        ".product-top-meta"
    );
if (productTopMeta) {
    productTopMeta.appendChild(
        deliveryElement
    );
}

// PRODUCT VARIANTS
const productVariants = {};
let selectedColor = null;
let selectedSize = null;

if(currentProduct.variants) {
    currentProduct.variants.forEach(variant => {
        const { color, sizes, image } = variant;
        productVariants[color] = { ...sizes, image };
    });
    // Default selection
    selectedColor = Object.keys(productVariants)[0];
    selectedSize = Object.keys(productVariants[selectedColor])[0];
}

let selectedColor = Object.keys(productVariants)[0] || "Black";
let selectedSize = Object.keys(productVariants[selectedColor] || {})[0] || "M";

// ELEMENTS
const colorButtons =
    document.querySelectorAll(
        ".color-btn"
    );

const sizeButtons =
    document.querySelectorAll(
        ".size-btn"
    );

// UPDATE VARIANT
function updateVariant(){
    const stock =
        productVariants[
            selectedColor
        ][selectedSize];

    if (variantStock) {
        variantStock.innerText =
            stock;
    }

    if(stock <= 3){
        if (variantStock) {
            variantStock.style.color =
            "red";
        }
    }else{
        if (variantStock) {
            variantStock.style.color =
            "#088178";
        }
    }

    if (mainImage) {
        mainImage.src =
            productVariants[
                selectedColor
            ].image;
    }
}

// COLOR EVENTS
colorButtons.forEach((button) => {
    button.addEventListener(
        "click",
        () => {
            colorButtons.forEach(
                (btn) => {
                    btn.classList.remove(
                        "active-color"
                    );
                }
            );
            button.classList.add(
                "active-color"
            );
            selectedColor =
                button.dataset.color;
            updateVariant();
        }
    );
});

// SIZE EVENTS
sizeButtons.forEach((button) => {
    button.addEventListener(
        "click",
        () => {
            sizeButtons.forEach(
                (btn) => {
                    btn.classList.remove(
                        "active-size"
                    );
                }
            );
            button.classList.add(
                "active-size"
            );
            selectedSize =
                button.dataset.size;
            updateVariant();
        }
    );
});

// INITIALIZE VARIANT
updateVariant();

// PRODUCT IMAGES
mainImage.src =
    currentProduct.image;
const galleryImages = currentProduct.images && currentProduct.images.length
    ? currentProduct.images
    : [currentProduct.image];

const smallImageGroup = document.querySelector(".small-image-group");
if(galleryImages.length <= 1) {
    if(smallImageGroup) smallImageGroup.style.display = "none";
} else {
    smallImages.forEach((image, index) => {
        image.src = galleryImages[index] || galleryImages[0];
        image.addEventListener("click", () => {
            mainImage.src = galleryImages[index] || galleryImages[0];
        });
    });
}

// QUANTITY CONTROLS
document.getElementById(
    "plus-btn"
).addEventListener(
    "click",
    () => {
        const currentVariantStock =
            productVariants[
                selectedColor
            ][selectedSize];

        if(
            parseInt(qtyInput.value)
            < currentVariantStock
        ){
            qtyInput.value =
                parseInt(qtyInput.value) + 1;
        }
    }
);

document.getElementById(
    "minus-btn"
).addEventListener(
    "click",
    () => {
        if(
            parseInt(qtyInput.value) > 1
        ){
            qtyInput.value =
                parseInt(qtyInput.value) - 1;
        }
    }
);

// ADD TO CART
elements.addToCartBtn.addEventListener("click", async () => {
    const currentVariantStock = productVariants[selectedColor][selectedSize];
    const qty = parseInt(qtyInput.value);

    if(currentVariantStock <= 0 || qty > currentVariantStock){
        notify("Selected variant is out of stock or quantity exceeds stock!", "error");
        return;
    }

    const item = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: parseFloat(currentProduct.price),
        img: mainImage.src,
        color: selectedColor,
        size: selectedSize,
        qty: qty
    };

    if(typeof addToCartFromProduct === "function"){
        await addToCartFromProduct(item);
    } else {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(p => p.id === item.id && p.color === item.color && p.size === item.size);
        if(existing) existing.qty += item.qty;
        else cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        notify("Product added to cart 🛍️");
    }
});

// BUY NOW
elements.buyNowBtn.addEventListener("click", () => {
    const currentVariantStock = productVariants[selectedColor][selectedSize];
    const qty = parseInt(qtyInput.value);

    if(currentVariantStock <= 0 || qty > currentVariantStock){
        notify("Selected variant is out of stock or quantity exceeds stock!", "error");
        return;
    }

    const cart = [{
        id: currentProduct.id,
        name: currentProduct.name,
        price: parseFloat(currentProduct.price),
        img: mainImage.src,
        color: selectedColor,
        size: selectedSize,
        qty: qty
    }];

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
});

function updateWishlistButton(){
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find(item => item.id === currentProduct.id);
    if (!wishlistBtn) return;
    wishlistBtn.innerHTML = exists
        ? `<i class="fas fa-heart"></i> Added To Wishlist`
        : `<i class="far fa-heart"></i> Wishlist`;
}

if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const exists = wishlist.find(item => item.id === currentProduct.id);

        if(!exists){
            wishlist.push({
                id: currentProduct.id,
                name: currentProduct.name,
                brand: currentProduct.brand,
                category: currentProduct.category,
                price: currentProduct.price,
                image: currentProduct.image
            });
            notify("Added to wishlist ❤️");
        } else {
            wishlist = wishlist.filter(item => item.id !== currentProduct.id);
            notify("Removed from wishlist ❌");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistButton();
    });
}

updateWishlistButton();

// RELATED PRODUCTS
let adminProducts = [];

// REVIEW STORAGE KEY
const reviewKey =
    `reviews-${currentProduct.id}`;

// LOAD REVIEWS
reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("review-name").value;
    const rating = parseInt(document.getElementById("review-rating").value);
    const comment = document.getElementById("review-comment").value;

    await apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify({ product_id: currentProduct.id, name, rating, comment })
    });

    notify("Review submitted! 📝");
    fetchReviews(); // refresh reviews from backend
    reviewForm.reset();
});

const wishlist =
    JSON.parse(
        localStorage.getItem(
            "wishlist"
        )
    ) || [];

const wishlistExists =
    wishlist.find(
        (item) =>
            item.id ===
            currentProduct.id
    );

if(wishlistExists){
    document.getElementById(
        "wishlist-btn"
    ).innerHTML = `
        <i class="fas fa-heart"></i>
        Added To Wishlist
    `;
}

const recentlyViewed =
    JSON.parse(
        localStorage.getItem(
            "recentlyViewed"
        )
    ) || [];

// HELPERS SECTION
async function fetchAllProducts() {
    try {
        const res = await apiRequest("/products");
        if (res.success && Array.isArray(res.products)) {
            adminProducts = res.products;
            renderRelatedProducts();
            renderRecommendedProducts();
        } else {
            adminProducts = [];
            notify("Failed to fetch products", "error");
            console.error("Failed to fetch products:", res);
        }
    } catch (err) {
        adminProducts = [];
        notify("Error fetching products", "error");
        console.error("Error fetching products:", err);
    }
}

function renderRelatedProducts() {
    const relatedProducts = adminProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
    if (relatedProducts.length === 0) {
        if (elements.relatedContainer) {
            elements.relatedContainer.innerHTML = `<p class="no-products">No related products available right now.</p>`;
        }
        return;
    }
    relatedProducts.forEach(product => renderProductCard(product, elements.relatedContainer));
}

function renderRecommendedProducts() {
    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let recommendedProducts = adminProducts.filter(item => {
        if(item.id === currentProduct.id) return false;
        if(item.category === currentProduct.category) return true;
        if(wishlist.find(w => w.category === item.category)) return true;
        if(recentlyViewed.find(v => v.category === item.category)) return true;
        return false;
    }).slice(0, 4);

    if(recommendedProducts.length === 0) {
        recommendedProducts = adminProducts.filter(item => item.id !== currentProduct.id).slice(0, 4);
    }

    if(recommendedProducts.length === 0) {
        if(elements.recommendedContainer) elements.recommendedContainer.innerHTML = `<p class="no-products">No recommendations available right now.</p>`;
        return;
    }

    recommendedProducts.forEach(product => renderProductCard(product, elements.recommendedContainer));
}

async function renderReviews() {
    if (!elements.reviewContainer) return;
    elements.reviewContainer.innerHTML = "";

    try {
        const res = await apiRequest(`/reviews?product_id=${currentProduct.id}`);
        const reviews = (res.success && Array.isArray(res.reviews)) ? res.reviews : [];

        if(reviews.length === 0){
            elements.reviewContainer.innerHTML = `<p>No reviews yet.</p>`;
            return;
        }

        reviews.forEach(review => {
            const reviewBox = document.createElement("div");
            reviewBox.classList.add("review-box");

            let stars = "";
            for(let i=0; i<review.rating; i++){
                stars += `<i class="fas fa-star"></i>`;
            }

            reviewBox.innerHTML = `
                <h4>${review.name}</h4>
                <div class="review-stars">${stars}</div>
                <p>${review.comment}</p>
                <div class="review-date">${review.date}</div>
            `;

            elements.reviewContainer.appendChild(reviewBox);
        });
    } catch(err) {
        console.error("Error fetching reviews:", err);
        notify("Error loading reviews", "error");
    }
}