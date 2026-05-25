// mobile navbar
function initializeMobileNavbar() {
    const bar =
        document.getElementById(
            "bar"
        );

    const navLinks =
        document.getElementById(
            "navbar-links"
        );

    if (
        !bar
        ||
        !navLinks
    ) {
        return;
    }

    bar.addEventListener(
        "click",
        () => {
            navLinks.classList.toggle(
                "active"
            );
        }
    );

    // close menu on link click
    navLinks
        .querySelectorAll(
            "a"
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "active"
                        );
                    }
                );
            }
        );
}

// sticky header
function initializeStickyHeader() {
    const header =
        document.getElementById(
            "header"
        );

    if (
        !header
    ) {
        return;
    }

    let ticking =
        false;

    window.addEventListener(
        "scroll",
        () => {
            if (
                !ticking
            ) {
                window.requestAnimationFrame(
                    () => {

                        header.style.boxShadow =
                            window.scrollY > 80
                                ? "0 5px 25px rgba(0,0,0,0.15)"
                                : "0 5px 15px rgba(0,0,0,0.06)";

                        ticking =
                            false;
                    }
                );

                ticking =
                    true;
            }
        }
    );
}

// ripple effect
function initializeRippleEffect() {
    document.addEventListener(
        "click",
        (event) => {
            const btn =
                event.target.closest(
                    "button"
                );

            if (
                !btn
            ) {
                return;
            }

            const ripple =
                document.createElement(
                    "span"
                );

            ripple.style.cssText =
                `
                    position:absolute;
                    width:10px;
                    height:10px;
                    background:rgba(255,255,255,0.7);
                    border-radius:50%;
                    transform:scale(0);
                    animation:ripple 0.6s linear;
                    pointer-events:none;
                    top:${event.offsetY}px;
                    left:${event.offsetX}px;
                `;

            if (
                getComputedStyle(
                    btn
                ).position ===
                "static"
            ) {

                btn.style.position =
                    "relative";
            }

            btn.style.overflow =
                "hidden";

            btn.appendChild(
                ripple
            );

            setTimeout(
                () => {

                    ripple.remove();

                },
                600
            );
        }
    );
}

// global cart count badge
function updateCartCount() {
    const cart =
        AppUtils.getCart();

    const total =
        cart.reduce(
            (
                sum,
                item
            ) => {
                return (
                    sum +
                    (
                        parseInt(
                            item.qty
                        ) || 0
                    )
                );
            },
            0
        );

    let badge =
        document.getElementById(
            "cart-count"
        );

    const cartIcon =
        document.querySelector(
            ".fa-shopping-bag"
        )?.parentElement;

    if (
        !cartIcon
    ) {
        return;
    }

    if (
        !badge
    ) {
        badge =
            document.createElement(
                "span"
            );

        badge.id =
            "cart-count";

        badge.style.cssText =
            `
                position:absolute;
                top:-8px;
                right:-10px;
                background:red;
                color:white;
                font-size:12px;
                padding:2px 6px;
                border-radius:50%;
                min-width:20px;
                text-align:center;
            `;

        if (
            getComputedStyle(
                cartIcon
            ).position ===
            "static"
        ) {

            cartIcon.style.position =
                "relative";
        }

        cartIcon.appendChild(
            badge
        );
    }

    badge.innerText =
        total;

    badge.style.display =
        total > 0
            ? "block"
            : "none";
}

// initialize ui
function initializeUI() {
    initializeMobileNavbar();
    initializeStickyHeader();
    initializeRippleEffect();
    updateCartCount();
}

// init after components load
document.addEventListener(
    "componentsLoaded",
    initializeUI
);

// fallback init
document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            initializeUI,
            300
        );
    }
);

// expose globally
window.updateCartCount =
    updateCartCount;