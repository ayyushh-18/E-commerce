import {
    getJSON,
    $,
    defaultImage
} from "./utils.js";

// LOAD ALL ORDERS
const orders =
    getJSON("orders") || [];

// ELEMENTS
const elements = {
    ordersContainer:
        $("#orders-history-container"),

    ordersCount:
        $("#orders-history-count")
};

// EMPTY STATE HELPER
const renderEmptyState = (
    container,
    message
) => {
    if(container){
        container.innerHTML =
            `<p>${message}</p>`;
    }
};

// DISPLAY ORDERS COUNT
if (elements.ordersCount) {
    elements.ordersCount.innerText =
        orders.length;
}

// DISPLAY ORDERS LIST
if (elements.ordersContainer) {
    elements.ordersContainer.innerHTML = "";
    if (orders.length === 0) {
        renderEmptyState(
            elements.ordersContainer,
            "No past orders found."
        );
    } else {
        orders.forEach((order) => {
            const div =
                document.createElement("div");
            div.classList.add(
                "order-history-item"
            );
            div.innerHTML = `
                <h4>
                    Order ID:
                    ${order.id || "N/A"}
                </h4>
                <p>
                    Date:
                    ${order.date || "N/A"}
                </p>
                <p>
                    Status:
                    ${order.status || "Pending"}
                </p>
                <div class="order-items-list">
                    ${(order.items || [])
                        .map(
                            (item) => `
                        <div class="order-item">
                            <img
                                src="${defaultImage(item.img)}"
                                alt="${item.name || "Product"}"
                            >
                            <div>
                                <h5>
                                    ${item.name || "Product"}
                                </h5>
                                <p>
                                    Qty:
                                    ${item.qty || 1}
                                </p>
                                <p>
                                    ₹${(
                                        (parseFloat(item.price) || 0) *
                                        (item.qty || 1)
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    `
                        )
                        .join("")}
                </div>
            `;
            elements.ordersContainer.appendChild(
                div
            );
        });
    }
}