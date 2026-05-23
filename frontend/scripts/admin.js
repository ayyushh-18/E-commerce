// ADMIN PANEL INITIALIZED
// Shared helpers are provided globally from utils.js

const user = getJSON("user");
const token = localStorage.getItem("token");

if (
    !token ||
    !user ||
    user.role !== "admin"
) {

    notify(
        "Admin access required",
        "error"
    );

    setTimeout(() => {
        window.location.href =
            "signin.html";
    }, 800);
}

// ELEMENTS
const elements = {
    productForm:
        document.getElementById(
            "product-form"
        ),

    productTableBody:
        document.getElementById(
            "product-table-body"
        ),

    ordersTableBody:
        document.getElementById(
            "orders-table-body"
        ),

    totalOrders:
        document.getElementById(
            "total-orders"
        ),

    totalProducts:
        document.getElementById(
            "total-products"
        ),

    totalUsers:
        document.getElementById(
            "total-users"
        ),

    totalRevenue:
        document.getElementById(
            "total-revenue"
        ),

    productName:
        document.getElementById(
            "product-name"
        ),

    productCategory:
        document.getElementById(
            "product-category"
        ),

    productPrice:
        document.getElementById(
            "product-price"
        ),

    productDescription:
        document.getElementById(
            "product-description"
        ),

    productImage:
        document.getElementById(
            "product-image"
        ),

    productStock:
        document.getElementById(
            "product-stock"
        ),

    featuredProduct:
        document.getElementById(
            "featured-product"
        )
};

// FETCH INITIAL DATA
let products = [];
let orders = [];

const loadInitialData = async () => {
    try {
        if(elements.productTableBody){
            elements.productTableBody.innerHTML =
                `<tr>
                    <td colspan="6">
                        Loading products...
                    </td>
                </tr>`;
        }
        const productsRes = await apiRequest("/products");
        if (productsRes.success) products = productsRes.products;

        const ordersRes = await apiRequest("/orders");
        if (ordersRes.success) orders = ordersRes.orders;

        renderProducts();
        renderOrders();
        renderStats();
    } catch (error) {
        console.error("Failed to load initial data", error);
    }
};

// RENDER STATS
function renderStats() {

    if (elements.totalOrders) {
        elements.totalOrders.innerText =
            (orders || []).length;
    }

    if (elements.totalProducts) {
        elements.totalProducts.innerText =
            (products || []).length;
    }

    if (elements.totalUsers) {
        elements.totalUsers.innerText =
            localStorage.getItem(
                "visits"
            ) || 0;
    }

    const revenue = (orders || []).reduce(
        (sum, order) => {

            return (
                sum +
                parseFloat(
                    order.total || 0
                )
            );

        },
        0
    );

    if (elements.totalRevenue) {
        elements.totalRevenue.innerText =
            `₹${revenue.toFixed(2)}`;
    }
}

// ADD PRODUCT
if (elements.productForm) {
    elements.productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const productData = {
            name:
                elements.productName.value,

            category:
                elements.productCategory.value,

            price:
                parseFloat(
                    elements.productPrice.value
                ) || 0,
            
            description:
                elements.productDescription.value,
            
            image:
                elements.productImage.value,
            
            stock:
                parseInt(
                    elements.productStock.value
                ) || 0,
            
            featured:
                elements.featuredProduct.checked
        };
        if(
            !productData.name.trim() ||
            !productData.category.trim()
        ){
            notify(
                "Product name and category are required",
                "error"
            );
            return;
        }
        try {
            const res = await apiRequest("/products", "POST", productData);
            if (res.success) {
                notify(
                    "Product added successfully!",
                    "success"
                );
                await loadInitialData();
                elements.productForm.reset();
            } else {
                notify(
                    res.message ||
                    "Failed to add product",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            notify(
                "Failed to add product.",
                "error"
            );
        }
    });
}

// RENDER PRODUCTS
function renderProducts() {
    if (!elements.productTableBody) return;
    elements.productTableBody.innerHTML = "";

    (products || []).forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.featured ? "Featured" : "—"}</td>
            <td>
                <button class="action-btn" onclick="editProduct(${product.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        elements.productTableBody.appendChild(row);
    });
}

// DELETE PRODUCT
async function deleteProduct(id) {
    try {
        const res = await apiRequest(`/products/${id}`, "DELETE");
        if (res.success) {
            products = products.filter(
                (p) => p.id !== id
            );
            renderProducts();
            renderStats();
            notify(
                "Product deleted successfully!",
                "success"
            );
        } else {
            notify(
                res.message ||
                "Failed to delete product",
                "error"
            );
        }
    } catch (error) {
        console.error(error);
        notify(
            "Failed to delete product.",
            "error"
        );
    }
}

// EDIT PRODUCT
async function editProduct(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newName = prompt("Edit Product Name", product.name);
    const newPrice = prompt("Edit Product Price", product.price);
    const newStock = prompt("Edit Product Stock", product.stock);

    if (
        newName?.trim() &&
        !isNaN(newPrice) &&
        !isNaN(newStock)
    ) {
        const updatedData = {
            name: newName.trim(),
            description:
                product.description || "",
            price: parseFloat(newPrice),
            image:
                product.image || "",
            category:
                product.category || "",
            stock: parseInt(newStock) || 0,
            featured:
                product.featured || false
        };

        try {
            const res = await apiRequest(`/products/${id}`, "PUT", updatedData);
            if (res.success) {
                Object.assign(product, updatedData);
                renderProducts();
                renderStats();
                notify(
                    "Product updated successfully!",
                    "success"
                );
            } else {
                notify(
                    res.message ||
                    "Failed to update product",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            notify(
                "Failed to update product.",
                "error"
            );
        }
    }
}

// RENDER ORDERS
function renderOrders() {
    if (!elements.ordersTableBody) return;
    elements.ordersTableBody.innerHTML = "";
    (orders || []).forEach((order) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>₹${parseFloat(
                order.total || 0
            ).toFixed(2)}</td>
        `;
        elements.ordersTableBody.appendChild(row);
    });
}

// INITIALIZE
loadInitialData();