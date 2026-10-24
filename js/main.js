
document.addEventListener("DOMContentLoaded", () => {
    /* ---------- MOBILE NAVIGATION ---------- */

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");

            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.textContent = isOpen ? "×" : "☰";
        });
    }

    /* ---------- CART ITEM COUNTER ---------- */

    const updateCount = () => {
        const count = window.HomeDecorCart
            ? window.HomeDecorCart.count()
            : 0;

        document.querySelectorAll(".cart-count").forEach(element => {
            element.textContent = count;

            element.classList.toggle("is-empty", count === 0);

            element.setAttribute(
                "aria-label",
                `${count} item${count === 1 ? "" : "s"} in cart`
            );
        });
    };

    updateCount();

    document.addEventListener("cart:updated", updateCount);

    window.addEventListener("storage", event => {
        if (event.key === "homedecor-cart") {
            updateCount();
        }
    });
});
