// product controls
const searchInput =
    document.getElementById(
        "product-search"
    );

const sortSelect =
    document.getElementById(
        "product-sort"
    );

const categoryFilter =
    document.getElementById(
        "category-filter"
    );

// filtered products
let filteredProducts =
    [];

// safe helpers
function safeText(
    value
) {
    return String(
        value || ""
    ).toLowerCase();
}

function safePrice(
    value
) {
    const parsed =
        parseFloat(value);

    return isNaN(parsed)
        ? 0
        : parsed;
}

// apply filters
function applyShopFilters() {
    let products =
        [...(
            window.allProducts || []
        )];

    // search filter
    const searchValue =
        searchInput?.value
            ?.trim()
            .toLowerCase();

    if (
        searchValue
    ) {
        products =
            products.filter(
                (product) => {
                    return (
                        safeText(
                            product.name
                        ).includes(
                            searchValue
                        )
                        ||
                        safeText(
                            product.category
                        ).includes(
                            searchValue
                        )
                    );
                }
            );
    }

    // category filter
    const category =
        categoryFilter?.value;

    if (
        category
        &&
        category !== "all"
    ) {
        products =
            products.filter(
                (product) =>
                    safeText(
                        product.category
                    ) ===
                    safeText(
                        category
                    )
            );
    }

    // sorting
    const sortValue =
        sortSelect?.value;

    switch (
        sortValue
    ) {
        case "low-high":
            products.sort(
                (a, b) =>
                    safePrice(
                        a.price
                    ) -
                    safePrice(
                        b.price
                    )
            );

            break;

        case "high-low":
            products.sort(
                (a, b) =>
                    safePrice(
                        b.price
                    ) -
                    safePrice(
                        a.price
                    )
            );

            break;

        case "name-a-z":
            products.sort(
                (a, b) =>
                    safeText(
                        a.name
                    ).localeCompare(
                        safeText(
                            b.name
                        )
                    )
            );

            break;

        case "name-z-a":
            products.sort(
                (a, b) =>
                    safeText(
                        b.name
                    ).localeCompare(
                        safeText(
                            a.name
                        )
                    )
            );

            break;

        default:
            break;
    }

    filteredProducts =
        products;

    updateFilteredUI();
}

// update UI
function updateFilteredUI() {

    if (
        typeof renderFeaturedProducts ===
        "function"
    ) {
        renderFeaturedProducts(
            filteredProducts
        );
    }

    if (
        typeof renderNewArrivals ===
        "function"
    ) {
        renderNewArrivals(
            filteredProducts
        );
    }
}

// listeners
if (
    searchInput
) {
    searchInput.addEventListener(
        "input",
        applyShopFilters
    );
}

if (
    sortSelect
) {
    sortSelect.addEventListener(
        "change",
        applyShopFilters
    );
}

if (
    categoryFilter
) {
    categoryFilter.addEventListener(
        "change",
        applyShopFilters
    );
}

// expose globally
window.applyShopFilters =
    applyShopFilters;