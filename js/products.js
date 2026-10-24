/* Home Decor product catalog and product cards. */
window.HOME_DECOR_PRODUCTS = [
  { id:"armchair-120", name:"Armchair", price:120, description:"Stylish seating for any living space", image:"../images/armchair.jpg", category:"furniture" },
  { id:"desk-350", name:"Desk", price:350, description:"Elegant wooden workspace for home or office", image:"../images/desk.jpg", category:"furniture" },
  { id:"sofa-150", name:"Sofa", price:150, description:"Comfortable vintage seating for your space", image:"../images/sofa.jpg", category:"furniture" },
  { id:"sideboard-350", name:"Cabinet", price:350, description:"Elegant storage solution for modern and vintage spaces", image:"../images/cabinet.jpg", category:"furniture" },
  { id:"armchair-85", name:"Chair", price:85, description:"Retro seating for your home", image:"../images/chair.jpg", category:"furniture" },
  { id:"chair-800", name:"Lamp Chair", price:800, description:"Distinctive design for stylish interiors", image:"../images/lampchair.jpg", category:"furniture" },
  { id:"armchair-280", name:"Soft Chair", price:280, description:"Comfortable seating for your living space", image:"../images/softchair.jpg", category:"furniture" },
  { id:"chair-90", name:"Table Chair", price:90, description:"A practical addition to your interior", image:"../images/tablechair.jpg", category:"furniture" },
  { id:"armchair-80", name:"Stool Chair", price:80, description:"Compact seating with a simple design", image:"../images/stoolchair.jpg", category:"furniture" },
  { id:"bar-stool-30", name:"Bar Stool", price:30, description:"Sleek seating with modern elegance", image:"../images/barstool.jpg", category:"furniture" }
];

function formatPrice(price) { return "€" + Number(price).toFixed(2); }
function productPhoto(product) {
  return `<img class="product-photo" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='../images/trolley.png';this.style.objectFit='contain';this.style.padding='25px'">`;
}
function productCard(product, shop=false) {
  return `<article class="product-card ${shop?'shop-product-card':'featured-product-card'}" data-product-id="${product.id}">
    ${productPhoto(product)}
    <div class="product-info"><div class="product-title-row"><h3 class="product-title">${product.name}</h3><p class="product-price">${formatPrice(product.price)}</p></div>
    ${shop?`<p class="product-description">${product.description}</p><button class="add-cart-button" type="button" data-add-to-cart="${product.id}"><span aria-hidden="true">🛒</span> Add to Cart</button>`:""}</div>
  </article>`;
}
document.addEventListener("DOMContentLoaded", () => {
  const featured = document.getElementById("featured-products");
  const allProducts = document.getElementById("all-products");
  if (featured) featured.innerHTML = window.HOME_DECOR_PRODUCTS.slice(0,4).map(p=>productCard(p)).join("");
  if (allProducts) {
    allProducts.innerHTML = window.HOME_DECOR_PRODUCTS.map(p=>productCard(p,true)).join("");
    allProducts.addEventListener("click", event => {
      const button = event.target.closest("[data-add-to-cart]");
      if (!button) return;
      if (!window.HomeDecorCart) { console.error("HomeDecorCart is unavailable. Check storage.js."); return; }
      window.HomeDecorCart.add(button.dataset.addToCart);
      document.dispatchEvent(new CustomEvent("cart:open"));
      const original = button.innerHTML;
      button.innerHTML = "✓ Added to Cart";
      button.disabled = true;
      window.setTimeout(() => { button.innerHTML = original; button.disabled = false; }, 800);
    });
  }
});
