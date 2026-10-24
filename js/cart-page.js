
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("cart-page-content");

    if (!root) return;

    const products = window.HOME_DECOR_PRODUCTS || [];
    const money = (amount) => `€${Number(amount).toFixed(2)}`;

    // Render the cart page
    const render = () => {
        const items = window.HomeDecorCart.get()
            .map((item) => ({
                ...item,
                product: products.find(
                    (product) => product.id === item.id
                ),
            }))
            .filter((item) => item.product);

        // Display an empty-cart message
        if (items.length === 0) {
            root.innerHTML = `
                <div class="cart-page-empty">
                    <img
                        src="../images/trolley.png"
                        alt="Shopping trolley"
                    >

                    <p>Your cart is empty.</p>

                    <a class="pill-button" href="shop.html">
                        Continue shopping <span>→</span>
                    </a>
                </div>
            `;

            return;
        }

        // Calculate the subtotal
        const subtotal = items.reduce(
            (sum, item) =>
                sum + item.product.price * item.quantity,
            0
        );

        // Display cart items and order summary
        root.innerHTML = `
            <div class="cart-page-layout">

                <section>
                    ${items.map((item) => `
                        <article
                            class="cart-page-product"
                            data-cart-page-item="${item.id}"
                        >
                            <img
                                src="${item.product.image}"
                                alt="${item.product.name}"
                            >

                            <div>
                                <h2>${item.product.name}</h2>

                                <p>
                                    ${money(item.product.price)} each
                                </p>

                                <div class="quantity-control">
                                    <button
                                        type="button"
                                        data-change="-1"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>

                                    <span>${item.quantity}</span>

                                    <button
                                        type="button"
                                        data-change="1"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>

                                    <button
                                        type="button"
                                        class="remove-item"
                                        data-remove
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <strong>
                                ${money(
                                    item.product.price * item.quantity
                                )}
                            </strong>
                        </article>
                    `).join("")}
                </section>

                <aside class="cart-page-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <strong>${money(subtotal)}</strong>
                    </div>

                    <p class="cart-disclaimer">
                        Shipping is free for this demo store.
                        No payment is processed.
                    </p>

                    <a class="pill-button" href="checkout.html">
                        Proceed to checkout <span>→</span>
                    </a>

                    <a class="cart-drawer-view" href="shop.html">
                        Continue shopping
                    </a>
                </aside>

            </div>
        `;
    };

    // Handle cart item actions
    root.addEventListener("click", (event) => {
        const row = event.target.closest("[data-cart-page-item]");

        if (!row) return;

        const id = row.dataset.cartPageItem;

        // Remove an item from the cart
        if (event.target.closest("[data-remove]")) {
            window.HomeDecorCart.remove(id);
            return;
        }

        // Increase or decrease the item quantity
        const button = event.target.closest("[data-change]");

        if (!button) return;

        const item = window.HomeDecorCart
            .get()
            .find((cartItem) => cartItem.id === id);

        if (!item) return;

        const quantity =
            item.quantity + Number(button.dataset.change);

        if (quantity <= 0) {
            window.HomeDecorCart.remove(id);
        } else {
            window.HomeDecorCart.setQuantity(id, quantity);
        }
    });

    // Re-render the page whenever the cart changes
    document.addEventListener("cart:updated", render);

    // Initial render
    render();
});
