
// LOAD ORDERS
const orders =
    getJSON("orders") || [];

// GET LATEST ORDER
const latestOrder =
    Array.isArray(orders) &&
    orders.length > 0
        ? orders[orders.length - 1]
        : null;

// REDIRECT IF NO ORDER
if(!latestOrder){
    window.location.href =
        "shop.html";

}

// ELEMENTS
const elements = {

    orderItemsContainer:
        document.getElementById(
            "order-items-container"
        ),

    orderId:
        document.getElementById(
            "order-id"
        ),

    orderDate:
        document.getElementById(
            "order-date"
        ),

    statusBadge:
        document.getElementById(
            "status-badge"
        ),

    processingStep:
        document.getElementById(
            "processing-step"
        ),

    shippedStep:
        document.getElementById(
            "shipped-step"
        ),

    deliveredStep:
        document.getElementById(
            "delivered-step"
        )
};

if (elements.orderId) {
    elements.orderId.innerText =
        latestOrder.id || "N/A";
}

if (elements.orderDate) {
    elements.orderDate.innerText =
        latestOrder.date || "N/A";
}

// STATUS
const status =
    latestOrder.status ||
    "Pending";

if (elements.statusBadge) {
    elements.statusBadge.innerText =
        status;
}

if (
    status === "Processing" ||
    status === "Shipped" ||
    status === "Delivered"
) {
    if (elements.processingStep) {
        elements.processingStep.classList.add(
            "active-step"
        );
    }
}
if (
    status === "Shipped" ||
    status === "Delivered"
) {
    if (elements.shippedStep) {
        elements.shippedStep.classList.add(
            "active-step"
        );
    }
}
if (
    status === "Delivered"
) {
    if (elements.deliveredStep) {
        elements.deliveredStep.classList.add(
            "active-step"
        );
    }
}

// RENDER ITEMS
const orderItems =
    latestOrder?.items || [];

(orderItems || []).forEach((item) => {
    const div =
        document.createElement("div");
    div.classList.add(
        "order-item"
    );

    div.innerHTML = `
        <div class="order-item-left">
            <img
                src="${defaultImage(item.img)}"
                alt="${item.name || 'Product'}"
            >
            <div>
                <h4>
                    ${item.name || "Product"}
                </h4>
                <p>
                    Quantity: ${item.qty || 1}
                </p>
            </div>
        </div>
        <h4>
            ₹${(
                (parseFloat(item.price) || 0) *
                (item.qty || 1)
            ).toFixed(2)}
        </h4>
    `;

    if (elements.orderItemsContainer) {
        elements.orderItemsContainer.appendChild(
            div
        );
    }
});