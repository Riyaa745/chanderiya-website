/* ==========================================
   Product Filters
========================================== */
const filterButtons = document.querySelectorAll('[data-filter]');
const productCards = document.querySelectorAll('.product-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    productCards.forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && !card.dataset.category.includes(filter));
    });
}));

/* ==========================================
   Inquiry Cart
========================================== */
const cartStorageKey = 'chanderiya-inquiry';
let shopCart = [];
try { shopCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]'); } catch {}

const drawer = document.querySelector('.cart-drawer');
const cartItems = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const whatsappLink = document.querySelector('[data-cart-whatsapp]');
const saveCart = () => {
    localStorage.setItem(cartStorageKey, JSON.stringify(shopCart));
    window.dispatchEvent(new Event('cart-updated'));
};
const renderCart = () => {
    if (!cartItems) return;
    cartItems.innerHTML = shopCart.map((item, index) =>
        `<div class="cart-item"><span>${item}</span><button type="button" data-remove-item="${index}" aria-label="Remove ${item}">Remove</button></div>`
    ).join('');
    cartEmpty.hidden = shopCart.length > 0;
    const message = `Hello Chanderiya Marketing & Sales,\n\nPlease share details and a quotation for:\n${shopCart.map(item => `• ${item}`).join('\n')}`;
    whatsappLink.href = `https://wa.me/919027398484?text=${encodeURIComponent(message)}`;
};
const openCart = () => {
    renderCart();
    drawer?.classList.add('open');
    drawer?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
};
const closeCart = () => {
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
};

document.querySelectorAll('.cart-icon').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    openCart();
}));
document.querySelectorAll('[data-cart-close]').forEach(button => button.addEventListener('click', closeCart));
document.querySelectorAll('[data-add-item]').forEach(button => button.addEventListener('click', () => {
    const item = button.dataset.addItem;
    if (!shopCart.includes(item)) shopCart.push(item);
    saveCart();
    renderCart();
    const original = button.textContent;
    button.textContent = 'Added ✓';
    button.classList.add('added');
    setTimeout(() => {
        button.textContent = original;
        button.classList.remove('added');
    }, 1500);
}));
cartItems?.addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove-item]');
    if (!removeButton) return;
    shopCart.splice(Number(removeButton.dataset.removeItem), 1);
    saveCart();
    renderCart();
});
document.querySelector('[data-cart-clear]')?.addEventListener('click', () => {
    shopCart = [];
    saveCart();
    renderCart();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeCart();
});
renderCart();
