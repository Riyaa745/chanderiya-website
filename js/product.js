const products = {
    desk: { title: 'Premium Executive Desk', category: 'Furniture · Workspace', price: '₹14,999', oldPrice: '₹18,999', image: 'assets/Premium Executive Desk.jpg', spec: 'Furniture', description: 'Built for dependable everyday use in commercial and institutional environments. A practical choice for executive cabins and professional workspaces.' },
    chair: { title: 'Ergonomic Mesh Chair', category: 'Furniture · Seating', price: '₹7,499', oldPrice: '₹9,999', image: 'assets/Ergonomic Mesh Chair.jpg', spec: 'Seating', description: 'Ergonomic commercial seating designed for focused work, comfort and dependable everyday performance.' },
    workstation: { title: 'Modular Office Workstation', category: 'Furniture · Modular', price: '₹19,999', oldPrice: '₹24,999', image: 'assets/modular-office-workstation.jpg', spec: 'Furniture', description: 'A modular workstation system that can be planned for teams, departments and growing office layouts.' },
    conference: { title: 'Conference Room Table', category: 'Furniture · Boardroom', price: '₹26,999', oldPrice: '₹32,999', image: 'assets/Conference Room Table.jpg', spec: 'Boardroom furniture', description: 'A durable conference table for collaborative spaces, available in practical sizes and finishes.' }
};

const productDetails = {
    desk: { sku: 'CMS-FUR-001', rating: '4.8', reviews: 24 },
    chair: { sku: 'CMS-CHR-002', rating: '4.7', reviews: 19 },
    workstation: { sku: 'CMS-FUR-003', rating: '4.9', reviews: 16 },
    conference: { sku: 'CMS-FUR-004', rating: '4.8', reviews: 12 }
};

const productKey = new URLSearchParams(location.search).get('product') || 'desk';
const product = products[productKey] || products.desk;
const details = productDetails[productKey] || productDetails.desk;
document.title = `${product.title} | Chanderiya Marketing & Sales`;

document.querySelectorAll('[data-product-sku]').forEach(item => item.textContent = details.sku);

document.querySelectorAll('[data-product-title]').forEach(item => item.textContent = product.title);
document.querySelectorAll('[data-product-breadcrumb]').forEach(item => item.textContent = product.title);
document.querySelectorAll('[data-product-category]').forEach(item => item.textContent = product.category);
document.querySelectorAll('[data-product-price]').forEach(item => item.textContent = product.price);
document.querySelectorAll('[data-product-old-price]').forEach(item => item.textContent = product.oldPrice);
document.querySelectorAll('[data-product-description], [data-product-long-description]').forEach(item => item.textContent = product.description);
document.querySelectorAll('[data-product-spec-category]').forEach(item => item.textContent = product.spec);
document.querySelectorAll('[data-product-image], .product-thumbnails img').forEach(item => {
    item.src = product.image;
    item.alt = product.title;
});

const quantity = document.querySelector('[data-product-quantity]');
document.querySelector('[data-quantity-minus]')?.addEventListener('click', () => {
    quantity.value = Math.max(1, Number(quantity.value) - 1);
});
document.querySelector('[data-quantity-plus]')?.addEventListener('click', () => {
    quantity.value = Number(quantity.value) + 1;
});

document.querySelector('[data-add-to-cart]')?.addEventListener('click', event => {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('chanderiya-inquiry') || '[]'); } catch {}
    const existing = cart.find(entry => (typeof entry === 'string' ? entry : entry.title) === product.title);
    if (existing && typeof existing === 'object') existing.quantity = (existing.quantity || 1) + Number(quantity.value);
    else if (!existing) cart.push({ title: product.title, quantity: Number(quantity.value), product: productKey });
    localStorage.setItem('chanderiya-inquiry', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    const button = event.currentTarget;
    const label = button.lastChild;
    const original = label.textContent;
    label.textContent = ' Added to cart';
    setTimeout(() => { label.textContent = original; }, 1500);
});

const wishlistButton = document.querySelector('[data-product-wishlist]');
const wishlistKey = 'chanderiya-wishlist';
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]'); } catch {}

const updateWishlistButton = () => {
    if (!wishlistButton) return;
    const active = wishlist.includes(productKey);
    wishlistButton.classList.toggle('active', active);
    wishlistButton.setAttribute('aria-pressed', String(active));
    wishlistButton.querySelector('i')?.classList.toggle('bi-heart', !active);
    wishlistButton.querySelector('i')?.classList.toggle('bi-heart-fill', active);
    const label = wishlistButton.querySelector('span');
    if (label) label.textContent = active ? 'Saved to wishlist' : 'Add to wishlist';
};

wishlistButton?.addEventListener('click', () => {
    wishlist = wishlist.includes(productKey) ? wishlist.filter(key => key !== productKey) : [...wishlist, productKey];
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    updateWishlistButton();
});
updateWishlistButton();

document.querySelector('[data-purchase-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = `Hello Chanderiya Marketing & Sales,\n\nI want to buy ${quantity.value} × ${product.title} (${product.price}).\nSize: ${form.get('size')}\nFinish: ${form.get('finish')}\n\nPlease share the next steps.`;
    window.open(`https://wa.me/919027398484?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
