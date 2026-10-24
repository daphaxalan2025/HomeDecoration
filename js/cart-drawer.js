
document.addEventListener("DOMContentLoaded", () => {
    const drawer = document.querySelector("[data-cart-drawer]");
    const overlay = document.querySelector("[data-cart-overlay]");
    const body = document.querySelector("[data-cart-drawer-body]");
    const footer = document.querySelector("[data-cart-drawer-footer]");

    if (!drawer || !overlay || !body || !footer) return;

    const products = window.HOME_DECOR_PRODUCTS || [];
    let previousFocus = null;

    const money = value => "€" + Number(value).toFixed(2);
    const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);

    const open = () => {
        if (drawer.classList.contains("is-open")) return;

        previousFocus = document.activeElement;

        drawer.classList.add("is-open");
        overlay.classList.add("is-open");

        drawer.setAttribute("aria-hidden", "false");
        overlay.setAttribute("aria-hidden", "false");

        document.querySelector("[data-cart-close]")?.focus();
    };

    const close = () => {
        drawer.classList.remove("is-open");
        overlay.classList.remove("is-open");

        drawer.setAttribute("aria-hidden", "true");
        overlay.setAttribute("aria-hidden", "true");

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    };

    const render = () => {
        const cart = window.HomeDecorCart
            ? window.HomeDecorCart.get()
            : [];

        const items = cart
            .map(item => ({
                ...item,
                product: products.find(
                    product => String(product.id) === String(item.id)
                )
            }))
            .filter(item => item.product);

        if (!items.length) {
            body.innerHTML = `
                <div class="cart-drawer-empty">
                    <img src="../images/trolley.png"
                         alt="Shopping trolley">
                    <p>Your cart is empty.</p>
                </div>
            `;

            footer.innerHTML = "";
            return;
        }

        body.innerHTML = `
            <div class="cart-drawer-items">
                ${items.map(({ id, quantity, product }) => `
                    <article
                        class="cart-drawer-item"
                        data-cart-item="${id}"
                    >
                        <img
                            class="cart-drawer-thumb"
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}"
                        >

                        <div class="cart-drawer-item-main">
                            <div class="cart-drawer-item-top">
                                <div>
                                    <h3 class="cart-drawer-item-name">
                                        ${escapeHTML(product.name)}
                                    </h3>

                                    <p class="cart-drawer-item-price">
                                        ${money(product.price)}
                                    </p>
                                </div>

                                <strong class="cart-drawer-item-total">
                                    ${money(product.price * quantity)}
                                </strong>
                            </div>

                            <div class="cart-drawer-item-bottom">
                                <div class="drawer-quantity"
                                     aria-label="Quantity for ${escapeHTML(product.name)}">
                                    <button type="button"
                                            data-change="-1"
                                            aria-label="Decrease quantity">
                                        −
                                    </button>

                                    <span>${quantity}</span>

                                    <button type="button"
                                            data-change="1"
                                            aria-label="Increase quantity">
                                        +
                                    </button>
                                </div>

                                <button type="button"
                                        class="drawer-remove"
                                        data-remove="${id}">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;

        const subtotal = items.reduce(
            (sum, item) =>
                sum + Number(item.product.price) * item.quantity,
            0
        );

        footer.innerHTML = `
            <div class="cart-drawer-total">
                <span>Total</span>
                <strong>${money(subtotal)}</strong>
            </div>

            <button class="cart-drawer-checkout"
                    type="button"
                    data-checkout>
                Proceed to Checkout
            </button>
        `;
    };

    document.querySelectorAll("[data-cart-open]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            open();
        });
    });

    document.querySelector("[data-cart-close]")
        ?.addEventListener("click", close);

    overlay.addEventListener("click", close);

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            drawer.classList.contains("is-open")
        ) {
            close();
        }
    });

    document.addEventListener("cart:open", open);
    document.addEventListener("cart:updated", render);

    body.addEventListener("click", event => {
        const remove = event.target.closest("[data-remove]");

        if (remove) {
            window.HomeDecorCart.remove(remove.dataset.remove);
            return;
        }

        const change = event.target.closest("[data-change]");

        if (!change) return;

        const itemElement = change.closest("[data-cart-item]");
        if (!itemElement) return;

        const id = itemElement.dataset.cartItem;

        const item = window.HomeDecorCart
            .get()
            .find(entry => String(entry.id) === String(id));

        if (!item) return;

        const nextQuantity =
            item.quantity + Number(change.dataset.change);

        if (nextQuantity <= 0) {
            window.HomeDecorCart.remove(id);
        } else {
            window.HomeDecorCart.setQuantity(id, nextQuantity);
        }
    });

    footer.addEventListener("click", event => {
        if (!event.target.closest("[data-checkout]")) return;

        if (!window.HomeDecorCart || !window.HomeDecorCart.count()) {
            return;
        }

        window.location.href = "checkout.html";
    });

    render();
});
