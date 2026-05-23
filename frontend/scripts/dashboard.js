const user = requireAuth();

if(user){
    loadUserData(user);
}

const elements = {
    userName:
        document.getElementById(
            "user-name"
        ),

    userEmail:
        document.getElementById(
            "user-email"
        ),

    settingsName:
        document.getElementById(
            "settings-name"
        ),

    settingsEmail:
        document.getElementById(
            "settings-email"
        ),

    menuItems:
        document.querySelectorAll(
            ".dashboard-menu li"
        ),

    tabs:
        document.querySelectorAll(
            ".dashboard-tab"
        ),

    wishlistContainer:
        document.getElementById(
            "wishlist-items"
        ),

    wishlistCount:
        document.getElementById(
            "wishlist-count"
        ),

    cartContainer:
        document.getElementById(
            "saved-cart-items"
        ),

    cartCount:
        document.getElementById(
            "cart-count-dashboard"
        ),

    ordersContainer:
        document.getElementById(
            "orders-list"
        ),

    ordersCount:
        document.getElementById(
            "orders-count"
        ),

    settingsForm:
        document.getElementById(
            "settings-form"
        )
};

const renderEmptyState = (
    container,
    message
) => {
    if(container){
        container.innerHTML =
            `<p>${message}</p>`;
    }
};

function loadUserData(user){
    if (elements.userName) {
    elements.userName.innerText = user.name || "User";
    }
    if (elements.userEmail) {
        elements.userEmail.innerText = (user.email || "").trim();
    }
    if (elements.settingsName) {
        elements.settingsName.value = user.name || "";
    }
    if (elements.settingsEmail) {
        elements.settingsEmail.value = (user.email || "").trim();
    }
}

elements.menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        elements.menuItems.forEach((menu) => {
            menu.classList.remove("active-tab");
        });
        elements.tabs.forEach((tab) => {
            tab.classList.remove("active");
        });
        item.classList.add("active-tab");
        const target = item.dataset.tab;
        const targetElement =
            document.getElementById(
                target
            );
        if (targetElement) {
            targetElement.classList.add(
                "active"
            );
        }
    });
});

const wishlist =
    getJSON("wishlist") || [];

if (elements.wishlistCount) {
    elements.wishlistCount.innerText =
        wishlist.length;
}

if(wishlist.length === 0){
    renderEmptyState(
        elements.wishlistContainer,
        "No wishlist items found."
    );
}else{
    wishlist.forEach((item) => {
        const p = document.createElement("p");
        p.innerText =
            item.name || item;
        if (elements.wishlistContainer) {
            elements.wishlistContainer.appendChild(p);
        }
    });
}

const cart =
    getJSON("cart") || [];

if (elements.cartCount) {
    elements.cartCount.innerText =
        cart.length;
}

if(cart.length === 0){
    renderEmptyState(
        elements.cartContainer,
        "No saved cart items found."
    );
}else{
    cart.forEach((item) => {
        const p = document.createElement("p");
        p.innerText = `${item.name} (${item.qty})`;
        if (elements.cartContainer) {
            elements.cartContainer.appendChild(p);
        }
    });
}

const orders =
    getJSON("orders") || [];

if (elements.ordersCount) {
    elements.ordersCount.innerText =
        orders.length;
}

if(orders.length === 0){
    renderEmptyState(
        elements.ordersContainer,
        "No orders found."
    );
}else{
    orders.forEach((order) => {
        const p = document.createElement("p");
        p.innerText =
            `${order.id} • ${order.date}`;

        if (elements.ordersContainer) {
            elements.ordersContainer.appendChild(p);
        }
    });
}

if (elements.settingsForm) {
    elements.settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedUser = {
            ...user,
            name:
                elements.settingsName.value.trim(),
            email:
                elements.settingsEmail.value.trim()
        };
        setJSON(
            "user",
            updatedUser
        );

        if(elements.userName){
            elements.userName.innerText =
                updatedUser.name;
        }

        if(elements.userEmail){
            elements.userEmail.innerText =
                updatedUser.email;
        }
        notify(
            "Profile updated successfully!",
            "success"
        );
    });
}

// HASH TAB NAVIGATION
function openTabFromHash(){
    const hash =
        window.location.hash.replace("#", "");
    if(!hash) return;
    elements.menuItems.forEach((menu) => {
        menu.classList.remove("active-tab");
    });

    elements.tabs.forEach((tab) => {
        tab.classList.remove("active");
    });

    const targetTab =
        document.getElementById(hash);

    const targetMenu =
        document.querySelector(
            `.dashboard-menu li[data-tab="${hash}"]`
        );

    if(targetTab){
        targetTab.classList.add("active");
    }

    if(targetMenu){
        targetMenu.classList.add(
            "active-tab"
        );
    }
}

window.addEventListener(
    "load",
    openTabFromHash
);