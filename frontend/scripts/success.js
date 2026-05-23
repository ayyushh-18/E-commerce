import {
    getJSON
} from "./utils.js";

// LOAD ORDER DATA
const orders =
    getJSON("orders") || [];

// ELEMENTS
const elements = {
    orderId:
        document.getElementById(
            "order-id"
        ),

    orderDate:
        document.getElementById(
            "order-date"
        ),

    successIcon:
        document.querySelector(
            ".success-icon"
        )
};

// LOAD LATEST ORDER
if(orders.length > 0){
    const latestOrder =
        orders[orders.length - 1];

    if(elements.orderId){
        elements.orderId.innerText =
            latestOrder.id || "N/A";
    }

    if(elements.orderDate){
        elements.orderDate.innerText =
            latestOrder.date || "N/A";
    }
}

// SUCCESS ANIMATION
if(elements.successIcon){
    elements.successIcon.animate(
        [
            {
                transform: "scale(0)"
            },
            {
                transform: "scale(1.1)"
            },
            {
                transform: "scale(1)"
            }
        ],
        {
            duration: 800,
            easing: "ease"
        }
    );
}