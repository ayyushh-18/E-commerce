// CHECKOUT PAGE INITIALIZED
// Shared helpers are provided globally from utils.js
const cart = getJSON("cart") || [];

if(!Array.isArray(cart) || cart.length === 0){
    notify("Your cart is empty!", "error");
    window.location.href = "cart.html";
}

const elements = {
    checkoutItems:
        document.getElementById(
            "checkout-items"
        ),

    subtotal:
        document.getElementById(
            "checkout-subtotal"
        ),

    tax:
        document.getElementById(
            "checkout-tax"
        ),

    total:
        document.getElementById(
            "checkout-total"
        ),

    cardDetails:
        document.getElementById(
            "card-details"
        ),

    checkoutForm:
        document.getElementById(
            "checkout-form"
        ),

    paymentMethods:
        document.querySelectorAll(
            'input[name="payment"]'
        ),

    fullName:
        document.getElementById(
            "full-name"
        ),

    email:
        document.getElementById(
            "email"
        ),

    phone:
        document.getElementById(
            "phone"
        ),

    city:
        document.getElementById(
            "city"
        ),

    state:
        document.getElementById(
            "state"
        ),

    zip:
        document.getElementById(
            "zip"
        ),

    address:
        document.getElementById(
            "address"
        )
};

// RENDER SUMMARY
function renderCheckout(){
    if (!elements.checkoutItems) return;

    elements.checkoutItems.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
        const price =
            parseFloat(item.price) || 0;
        subtotal += price * (item.qty || 1);

        const div = document.createElement("div");
        div.classList.add("checkout-item");
        div.innerHTML = `
            <span>${item.name} (${item.qty || 1})</span>
            <span>₹${(
                price * (item.qty || 1)
            ).toFixed(2)}</span>
        `;
        elements.checkoutItems.appendChild(div);
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    if (elements.subtotal) {
        elements.subtotal.innerText =
            `₹${subtotal.toFixed(2)}`;
    }

    if (elements.tax) {
        elements.tax.innerText =
            `₹${tax.toFixed(2)}`;
    }

    if (elements.total) {
        elements.total.innerText =
            `₹${total.toFixed(2)}`;
    }
}

renderCheckout();

// PAYMENT METHOD TOGGLE
elements.paymentMethods.forEach((method) => {
    method.addEventListener("change", () => {
        if (elements.cardDetails) {
            elements.cardDetails.style.display =
                method.value === "Card"
                    ? "block"
                    : "none";
        }
    });
});

// PLACE ORDER
if (elements.checkoutForm) {
elements.checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if(!Array.isArray(cart) || cart.length === 0){
        notify("Your cart is empty!", "error");
        return;
    }

    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!selectedPayment) {
        notify(
            "Select a payment method",
            "error"
        );
        return;
    }

    if(
        !elements.fullName.value.trim() ||
        !elements.email.value.trim() ||
        !elements.phone.value.trim()
    ){
        notify(
            "Please fill all required customer details",
            "error"
        );
        return;
    }

    const order = {
        customer: {
            name:
                elements.fullName.value.trim(),

            email:
                elements.email.value.trim(),

            phone:
                elements.phone.value.trim()
        },
        address: {
            city:
                elements.city.value.trim(),

            state:
                elements.state.value.trim(),

            zip:
                elements.zip.value.trim(),

            fullAddress:
                elements.address.value.trim()
        },
        paymentMethod:
            selectedPayment.value,
        items: cart,
        total: elements.total
            ? parseFloat(
                elements.total.innerText.replace(
                    /[^\d\.]/g,
                    ""
                )
              )
            : 0
    };

    try {
        const data = await apiRequest(
            "/orders",
            {
                method: "POST",
                body: JSON.stringify(order)
            }
        );
        if(data.success){
            notify(
                "Order placed successfully! 🎉",
                "success"
            );
            setJSON("cart", []);
            window.location.href = "order.html";
        } else {
            notify(
                data.message ||
                "Failed to place order",
                "error"
            );
        }

    } catch(error){
        console.error(error);
        notify(
            "Failed to place order",
            "error"
        );
    }
});
}