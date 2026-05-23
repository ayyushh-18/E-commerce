import {
    API_BASE,
    getJSON,
    setJSON,
    notify,
    defaultImage
} from "./utils.js";

let allProducts = []; // will store all products fetched from backend
async function fetchAllProducts(){
    try{
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        if(data.success) allProducts = data.products;
    }catch(err){
        console.error("Failed to fetch all products", err);
    }
}

fetchAllProducts();

function renderProducts(products){
    const container = document.getElementById("products-container");
    if(!container) return;
    container.innerHTML = "";
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// API BASE URL & GLOBAL STATE
let cart =
    getJSON("cart") || [];
let viewed =
    getJSON("viewed") || [];
let wishlist =
    getJSON("wishlist") || [];

// HELPER: CREATE PRODUCT CARD
function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("pro");
    card.innerHTML = `
        <img src="${defaultImage(product.image)}" alt="${product.name}">
        <div class="des">
            <span>${product.brand || "Brand"}</span>
            <h5>${product.name}</h5>
            <div class="star">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <h4>₹${product.price}</h4>
        </div>
        <button class="cart">Add to Cart</button>
        <span class="wishlist-heart">❤</span>
    `;

    // Navigate to product page
    card.addEventListener("click", () => {
        setJSON("selectedProduct", product);
        window.location.href = "product.html";
    });

    // Add to cart button
    card.querySelector(".cart").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product);
    });

    // Wishlist toggle
    card.querySelector(".wishlist-heart").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWishlist(product, e.target);
    });

    return card;
}

// MOBILE NAVBAR
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");

if (bar) {
    bar.addEventListener("click", () => {
        nav.classList.toggle("active");
        nav.style.right = nav.style.right === "0px" ? "-300px" : "0px";
    });
}
// STICKY HEADER EFFECT
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
        if (window.scrollY > 80) {
            header.style.boxShadow = "0 5px 25px rgba(0,0,0,0.15)";
        } else {
        header.style.boxShadow = "none";
    }
});

// ADD TO CART
function addToCart(product) {
    const item = {
        name: product.name,
        price: product.price,
        img: product.image,
        qty: 1
    };

    const existing = cart.find(p => p.id === product.id);
    if (existing) existing.qty++;
    else cart.push({ ...item, id: product.id });

    setJSON("cart", cart);
    updateCartCount();
    notify("Added to Cart 🛍️");

    // Optional: POST to backend for logged-in users
    // fetch(`${API_BASE}/cart/add`, { method: "POST", body: JSON.stringify(item) });
}

// WISHLIST TOGGLE
function toggleWishlist(product, heartEl) {
    if (wishlist.find(p => p.name === product.name)) {
        wishlist = wishlist.filter(p => p.name !== product.name);
        heartEl.style.color = "white";
        notify("Removed from Wishlist ❌");
    } else {
        wishlist.push(product);
        heartEl.style.color = "red";
        notify("Added to Wishlist ❤️");
    }
    setJSON("wishlist", wishlist);
    // Optional: POST to backend for logged-in users
    // fetch(`${API_BASE}/wishlist/toggle`, { method: "POST", body: JSON.stringify(product) });
}

// CART COUNT BADGE
function updateCartCount() {
    let total = cart.reduce((sum, item) => sum + item.qty, 0);
    let badge = document.getElementById("cart-count");
    if (!badge) {
        badge = document.createElement("span");
        badge.id = "cart-count";
        badge.style.cssText = `       position:absolute;
            top:-8px;
            right:-10px;
            background:red;
            color:white;
            font-size:12px;
            padding:2px 6px;
            border-radius:50%;
        `;
        const cartIcon = document.querySelector(".fa-shopping-bag")?.parentElement;
        if (cartIcon) cartIcon.appendChild(badge);
    }   
    badge.innerText = total;
}

updateCartCount();

// PRODUCT QUICK VIEW
document
.querySelectorAll(".pro img")
.forEach((img) => {
    img.addEventListener(
        "click",
        () => {
            const modal =
                document.createElement(
                    "div"
                );
            modal.style.cssText = `
                position:fixed;
                inset:0;
                background:rgba(0,0,0,0.7);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:9999;
            `;
            const box =
                document.createElement(
                    "div"
                );
            box.style.cssText = `
                background:white;
                padding:20px;
                border-radius:10px;
                text-align:center;
            `;
            const big =
                document.createElement(
                    "img"
                );
            big.src = img.src;
            big.style.width =
                "300px";
            box.appendChild(big);
            modal.appendChild(box);
            document.body.appendChild(
                modal
            );
            modal.onclick = () => {
                modal.remove();
            };
        }
    );
});

// NEWSLETTER VALIDATION
const newsletterBtn = document.querySelector("#newsletter button");
if (newsletterBtn) {
    newsletterBtn.addEventListener("click", () => {
        const input = document.querySelector("#newsletter input");
        const email = input.value.trim();

        if (!email.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
            notify("Enter valid email ❌");
        } else {
            notify("Subscribed Successfully 🎉");
            input.value = "";
        }
    });
}

// SCROLL ANIMATION
const observer = new IntersectionObserver(
    (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.transform = "translateY(0)";
            entry.target.style.opacity = "1";
        }
    });
    },
    { threshold: 0.1 }
);

document.querySelectorAll(".pro, .fe-box, .banner-box").forEach((el) => {
    el.style.transform = "translateY(40px)";
    el.style.opacity = "0";
    el.style.transition = "0.6s ease";
    observer.observe(el);
});

// BUTTON RIPPLE EFFECT
document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        ripple.style.cssText = `       position:absolute;
            width:10px;height:10px;
            background:white;
            border-radius:50%;
            transform:scale(0);
            animation:ripple 0.6s linear;
            top:${e.offsetY}px;
            left:${e.offsetX}px;
        `;
        this.style.position = "relative";
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// RECENTLY VIEWED PRODUCTS
document.querySelectorAll(".pro").forEach((card) => {
    card.addEventListener("click", () => {

        const product = {
            name: card.querySelector("h5")?.innerText,
            image: card.querySelector("img")?.src,
            brand: card.querySelector(".des span")?.innerText,
            price: card.querySelector("h4")?.innerText
        };

        viewed.unshift(product);

        viewed = [
            ...new Map(
                viewed.map(p => [p.name, p])
            ).values()
        ].slice(0, 5);

        setJSON(
            "viewed",
            JSON.stringify(viewed)
        );
    });
});

// ESTIMATED DELIVERY DATE
function deliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 5 + 3));
    return date.toDateString();
}

document.querySelectorAll(".pro").forEach(card => {
    const d = document.createElement("p");
    d.style.fontSize = "11px";
    d.style.color = "gray";
    d.innerText = "Delivery by: " + deliveryDate();
    card.appendChild(d);
});

// AUTO HERO TEXT SLIDER
const heroTexts = [
    "Super Deals Today 🔥",
    "Limited Time Offer ⏰",
    "New Collection Arrived 👕",
    "Flat 70% OFF 💸"
];

let i = 0;
setInterval(() => {
    const hero = document.querySelector("#hero h2");
    if(hero){
        hero.innerText = heroTexts[i];
        i = (i + 1) % heroTexts.length;
    }
}, 2500);

// HIGHLIGHT NEW PRODUCTS
document.querySelectorAll(".pro").forEach((card, index) => {
    if(index < 2){
        const tag = document.createElement("span");
        tag.innerText = "NEW";
        tag.style.cssText = `     position:absolute;
            top:10px;
            right:10px;
            background:red;
            color:white;
            padding:3px 6px;
            font-size:10px;
            border-radius:4px;
            `;
        card.appendChild(tag);
    }
});

// IMAGE HOVER ZOOM
document.querySelectorAll(".pro img").forEach(img=>{
        img.style.transition="0.3s";
        img.addEventListener("mousemove",(e)=>{
            img.style.transform="scale(1.2)";
        });
        img.addEventListener("mouseleave",()=>{
            img.style.transform="scale(1)";
        });
});

// QUANTITY BUTTONS (ON PRODUCT CLICK)
document.querySelectorAll(".pro").forEach(card=>{
    const qtyBox = document.createElement("div");
    qtyBox.style.marginTop="8px";
    const minus=document.createElement("button");
    const plus=document.createElement("button");
    const count=document.createElement("span");
    minus.innerText="-";
    plus.innerText="+";
    count.innerText="1";
    [minus,plus].forEach((b)=>{
        b.style.cssText = `
            width:36px;
            height:36px;
            border:none;
            border-radius:8px;
            background:#f3f3f3;
            font-size:18px;
            cursor:pointer;
            transition:0.3s ease;
        `;
    });
    minus.onclick=()=>{ if(count.innerText>1) count.innerText--; };
    plus.onclick=()=>{ count.innerText++; };
    qtyBox.append(minus,count,plus);
    card.appendChild(qtyBox);
});

// LAZY IMAGE LOADING (PERFORMANCE)\
const lazyImgs=document.querySelectorAll("img");
const lazyObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            const img=entry.target;
            img.src=img.src;
            lazyObserver.unobserve(img);
        }
    });
});

lazyImgs.forEach(img=>lazyObserver.observe(img));

// CART DRAWER SYSTEM
const cartDrawer = document.createElement("div");
cartDrawer.style.cssText = `
position:fixed;
top:0;
right:-400px;
width:350px;
height:100vh;
background:white;
box-shadow:-5px 0 20px rgba(0,0,0,.2);
padding:20px;
overflow-y:auto;
transition:0.4s;
z-index:99999;
`;
document.body.appendChild(cartDrawer);

function renderCartDrawer() {
  cartDrawer.innerHTML = "<h2>Your Cart</h2>";
  
  if(cart.length === 0){
    cartDrawer.innerHTML += "<p>Cart is Empty</p>";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index)=>{
    const price =
        parseFloat(item.price) || 0;
    subtotal += price * item.qty;

    const div = document.createElement("div");
    div.style.marginBottom="15px";
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      ₹${price} x ${item.qty}
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartDrawer.appendChild(div);
  });

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  cartDrawer.innerHTML += `
    <hr>
    <p>Subtotal: ₹${subtotal}</p>
    <p>Tax (18%): ₹${tax.toFixed(2)}</p>
    <h3>Total: ₹${total.toFixed(2)}</h3>

    <input
      type="text"
      id="coupon-code"
      placeholder="Enter Coupon Code"
      style="
        width:100%;
        padding:10px;
        margin:10px 0;
        border:1px solid #ccc;
        border-radius:6px;
      "
    >

    <button onclick="applyCoupon()">
      Apply Coupon
    </button>

    <button onclick="window.location.href='checkout.html'">
          Checkout
    </button>

    <button onclick="clearCart()">
      Clear Cart
    </button>
  `;
}

function applyCoupon(){
    const input = document.getElementById("coupon-code");
    if(!input) return;
    const code = input.value.trim();

    // Send coupon to backend for validation
    fetch(`${API_BASE}/cart/apply-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
    })
    .then(res => res.json())
    .then(data => notify(data.message))
    .catch(err => notify("Error validating coupon ❌"));
}

function openCart(){
  renderCartDrawer();
  cartDrawer.style.right="0";
}
function closeCart(){
  cartDrawer.style.right="-400px";
}
document.querySelector(".fa-shopping-bag")?.parentElement.addEventListener("click",(e)=>{
  e.preventDefault();
  openCart();
});
cartDrawer.addEventListener("mouseleave",closeCart);

function removeItem(index){
  cart.splice(index,1);
  setJSON("cart",JSON.stringify(cart));
  renderCartDrawer();
  updateCartCount();
}
function clearCart(){
  cart=[];
  setJSON("cart", []);
  renderCartDrawer();
  updateCartCount();
}

// CLICKABLE STAR RATING
document.querySelectorAll(".star").forEach(starContainer=>{
  const stars=starContainer.querySelectorAll("i");
  stars.forEach((star,index)=>{
    star.style.cursor="pointer";
    star.onclick=()=>{
      stars.forEach((s,i)=>{
        s.style.color = i<=index ? "gold" : "#ccc";
      });
    };
  });
});

// SEARCH PRODUCTS\
const productSearch =
    document.getElementById(
        "product-search"
    );

if(productSearch){
    productSearch.addEventListener(
        "keyup",
        () => {
            const value =
                productSearch.value
                .toLowerCase();

            const filtered =
                allProducts.filter(
                    (product) => {
                        return (
                            product.name
                            .toLowerCase()
                            .includes(value)
                        );
                    }
                );
            renderProducts(filtered);
        }
    );
}

// SORT PRODUCTS
const productSort =
    document.getElementById(
        "product-sort"
    );

if(productSort){
    productSort.addEventListener(
        "change",
        () => {
            let sorted =
                [...allProducts];

            if(
                productSort.value
                === "low-high"
            ){
                sorted.sort(
                    (a, b) =>
                        a.price - b.price
                );
            }
            if(
                productSort.value
                === "high-low"
            ){
                sorted.sort(
                    (a, b) =>
                        b.price - a.price
                );
            }
            renderProducts(sorted);
        }
    );
}