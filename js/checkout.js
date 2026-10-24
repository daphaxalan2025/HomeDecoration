
document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.querySelector("#checkout-form");
    const itemsContainer = document.querySelector("#checkout-items");
    const subtotalElement = document.querySelector("#checkout-subtotal");
    const totalElement = document.querySelector("#checkout-total");

    const discountForm = document.querySelector("#discount-form");
    const discountInput = document.querySelector("#discount-code");
    const discountMessage = document.querySelector("#discount-message");
    const discountButton = document.querySelector("#discount-apply");

    const successOverlay = document.querySelector("#order-success-overlay");
    const successClose = document.querySelector("#order-success-close");
    const continueButton = document.querySelector("#order-success-continue");

    const orderMessage = document.querySelector("#order-message");

    if (
        !checkoutForm ||
        !itemsContainer ||
        !subtotalElement ||
        !totalElement
    ) {
        return;
    }

    const products = window.HOME_DECOR_PRODUCTS || [];
    const money = value => "€" + Number(value).toFixed(2);

    let subtotal = 0;
    let discount = 0;
    let previousFocus = null;
    let orderProcessing = false;

    const escapeHTML = value =>
        String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);

    /*
     * Make sure the confirmation is hidden when checkout loads.
     * The CSS uses the is-open class.
     */
    const closeSuccessModal = () => {
        if (!successOverlay) return;

        successOverlay.classList.remove("is-open");
        successOverlay.setAttribute("aria-hidden", "true");

        if (previousFocus && document.contains(previousFocus)) {
            previousFocus.focus();
        }
    };

    const openSuccessModal = () => {
        if (!successOverlay) return false;

        previousFocus = document.activeElement;

        successOverlay.classList.add("is-open");
        successOverlay.setAttribute("aria-hidden", "false");

        if (successClose) {
            successClose.focus();
        }
        return true;
    };

    if (successOverlay) {
        closeSuccessModal();
    }

    const getItems = () => {
        const cart = window.HomeDecorCart
            ? window.HomeDecorCart.get()
            : [];

        return cart
            .map(item => ({
                ...item,
                product: products.find(
                    product =>
                        String(product.id) === String(item.id)
                )
            }))
            .filter(item => item.product);
    };

    const updateTotals = () => {
        const total = Math.max(0, subtotal - discount);

        subtotalElement.textContent = money(subtotal);
        totalElement.textContent = money(total);
    };

    const renderCheckout = () => {
        const items = getItems();

        if (!items.length) {
            itemsContainer.innerHTML = `
                <div class="checkout-empty">
                    <p>Your cart is empty.</p>
                    <a class="checkout-return" href="shop.html">
                        ← Return to store
                    </a>
                </div>
            `;

            subtotal = 0;
            discount = 0;

            subtotalElement.textContent = money(0);
            totalElement.textContent = money(0);

            if (discountMessage) {
                discountMessage.textContent = "";
            }

            return;
        }

        itemsContainer.innerHTML = items.map(({ quantity, product }) => `
            <article class="checkout-summary-item">
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >

                <div>
                    <p class="checkout-summary-name">
                        ${escapeHTML(product.name)}
                    </p>

                    ${quantity > 1
                        ? `<p>${quantity} items</p>`
                        : ""}
                </div>

                <strong class="checkout-summary-price">
                    ${money(Number(product.price) * quantity)}
                </strong>
            </article>
        `).join("");

        subtotal = items.reduce(
            (sum, item) =>
                sum + Number(item.product.price) * item.quantity,
            0
        );

        updateTotals();
    };

    /* ---------- FIELD VALIDATION ---------- */

    const validateField = field => {
        const error = document.querySelector(
            `[data-error-for="${field.id}"]`
        );

        const value = field.value.trim();
        let valid = value.length > 0;

        if (field.id === "email") {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        field.setAttribute("aria-invalid", String(!valid));

        if (error) {
            error.classList.toggle("is-visible", !valid);
        }

        return valid;
    };

    checkoutForm.querySelectorAll(
        "input[required], select[required]"
    ).forEach(field => {
        field.addEventListener("input", () => {
            validateField(field);

            if (orderMessage) {
                orderMessage.textContent = "";
            }
        });

        field.addEventListener("change", () => {
            validateField(field);

            if (orderMessage) {
                orderMessage.textContent = "";
            }
        });
    });

    /* ---------- DEMO DISCOUNT ---------- */

    if (discountForm && discountInput && discountMessage) {
        discountForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!discountInput.value.trim()) {
                discountMessage.textContent =
                    "Enter a discount code first.";
                discountMessage.style.color = "#e12636";
                return;
            }

            discount = 0;
            updateTotals();

            discountMessage.textContent =
                "Discount codes are not configured in this demo.";

            discountMessage.style.color = "#e12636";
        });

        discountInput.addEventListener("input", () => {
            if (discountButton) {
                discountButton.classList.toggle(
                    "is-active",
                    discountInput.value.trim().length > 0
                );
            }

            discountMessage.textContent = "";
        });
    }

    /* ---------- PLACE ORDER ---------- */

    checkoutForm.addEventListener("submit", event => {
        event.preventDefault();
        if (orderProcessing) return;

        const items = getItems();

        if (orderMessage) {
            orderMessage.textContent = "";
        }

        if (!items.length) {
            if (orderMessage) {
                orderMessage.textContent =
                    "Your cart is empty. Please add a product first.";
                orderMessage.style.color = "#e12636";
            }

            return;
        }

        const fields = [
            ...checkoutForm.querySelectorAll(
                "input[required], select[required]"
            )
        ];

        const invalidFields = fields.filter(
            field => !validateField(field)
        );

        if (invalidFields.length) {
            if (orderMessage) {
                orderMessage.textContent =
                    "Please complete the required fields.";
                orderMessage.style.color = "#e12636";
            }

            invalidFields[0].focus();
            invalidFields[0].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }

        /*
         * Demo only:
         * No order is saved to a server and no payment is processed.
         *
         * Show the thank-you modal only after validation succeeds.
         */
        orderProcessing = true;
        const submitButton = checkoutForm.querySelector('[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        // This project is a frontend demo: successful validation and opening
        // the existing confirmation modal is its current success condition.
        // Do not clear the cart before reaching this point.
        const successShown = openSuccessModal();
        if (successShown && window.HomeDecorCart) {
            window.HomeDecorCart.clear();
        } else if (orderMessage) {
            orderMessage.textContent = "We couldn't confirm the order. Your cart has been kept.";
            orderMessage.style.color = "#e12636";
        }

        if (submitButton) submitButton.disabled = false;
        orderProcessing = false;
    });

    /* ---------- CLOSE CONFIRMATION ---------- */

    if (successClose) {
        successClose.addEventListener("click", closeSuccessModal);
    }

    if (successOverlay) {
        successOverlay.addEventListener("click", event => {
            if (event.target === successOverlay) {
                closeSuccessModal();
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            successOverlay &&
            successOverlay.classList.contains("is-open")
        ) {
            closeSuccessModal();
        }
    });

    /* ---------- CONTINUE SHOPPING ---------- */

    if (continueButton) {
        continueButton.addEventListener("click", () => {
            window.location.href = "shop.html";
        });
    }

    /* ---------- KEEP CART SUMMARY UPDATED ---------- */

    document.addEventListener("cart:updated", renderCheckout);

    window.addEventListener("storage", event => {
        if (event.key === "homedecor-cart") {
            renderCheckout();
        }
    });

    renderCheckout();
});
