/* Shared cart storage. This demo uses localStorage and does not require a database. */
(() => {
  const CART_KEY = "homedecor-cart";
  const safeQuantity = value => Math.max(1, Math.floor(Number(value) || 1));
  window.HomeDecorCart = {
    get() {
      try {
        const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(parsed) ? parsed.filter(x => x && typeof x.id === "string" && Number(x.quantity) > 0).map(x => ({id:x.id, quantity:safeQuantity(x.quantity)})) : [];
      } catch { return []; }
    },
    save(cart) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      document.dispatchEvent(new CustomEvent("cart:updated", {detail:cart}));
    },
    add(productId) {
      const cart = this.get();
      const existing = cart.find(item => item.id === productId);
      if (existing) existing.quantity += 1;
      else cart.push({id:productId, quantity:1});
      this.save(cart);
    },
    setQuantity(productId, quantity) {
      const cart = this.get();
      const item = cart.find(entry => entry.id === productId);
      if (!item) return;
      if (Number(quantity) <= 0) return this.remove(productId);
      item.quantity = safeQuantity(quantity);
      this.save(cart);
    },
    remove(productId) { this.save(this.get().filter(item => item.id !== productId)); },
    clear() { this.save([]); },
    count() { return this.get().reduce((sum,item) => sum + item.quantity, 0); },
    subtotal(products=window.HOME_DECOR_PRODUCTS || []) {
      return this.get().reduce((sum,item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
    }
  };
})();
