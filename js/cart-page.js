document.addEventListener("DOMContentLoaded",()=>{
 const root=document.getElementById("cart-page-content"); if(!root)return;
 const products=window.HOME_DECOR_PRODUCTS||[]; const money=n=>"€"+Number(n).toFixed(2);
 const render=()=>{
  const items=window.HomeDecorCart.get().map(i=>({...i,product:products.find(p=>p.id===i.id)})).filter(i=>i.product);
  if(!items.length){root.innerHTML=`<div class="cart-page-empty"><img src="../images/trolley.png" alt="Shopping trolley"><p>Your cart is empty.</p><a class="pill-button" href="shop.html">Continue shopping <span>→</span></a></div>`;return;}
  const subtotal=items.reduce((s,i)=>s+i.product.price*i.quantity,0);
  root.innerHTML=`<div class="cart-page-layout"><section>${items.map(i=>`<article class="cart-page-product" data-cart-page-item="${i.id}"><img src="${i.product.image}" alt="${i.product.name}"><div><h2>${i.product.name}</h2><p>${money(i.product.price)} each</p><div class="quantity-control"><button type="button" data-change="-1">−</button><span>${i.quantity}</span><button type="button" data-change="1">+</button><button type="button" class="remove-item" data-remove>Remove</button></div></div><strong>${money(i.product.price*i.quantity)}</strong></article>`).join("")}</section><aside class="cart-page-summary"><div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><p class="cart-disclaimer">Shipping is free for this demo store. No payment is processed.</p><a class="pill-button" href="checkout.html">Proceed to checkout <span>→</span></a><a class="cart-drawer-view" href="shop.html">Continue shopping</a></aside></div>`;
 };
 root.addEventListener("click",e=>{const row=e.target.closest("[data-cart-page-item]");if(!row)return;const id=row.dataset.cartPageItem;if(e.target.closest("[data-remove]")){window.HomeDecorCart.remove(id);return;}const b=e.target.closest("[data-change]");if(b){const item=window.HomeDecorCart.get().find(x=>x.id===id);if(!item)return;const q=item.quantity+Number(b.dataset.change);if(q<=0)window.HomeDecorCart.remove(id);else window.HomeDecorCart.setQuantity(id,q);}});
 document.addEventListener("cart:updated",render);render();
});