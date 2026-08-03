const cartKey = 'chanderiya-inquiry';
const catalogue = {
    desk: { title: 'Premium Executive Desk', price: 14999 },
    chair: { title: 'Ergonomic Mesh Chair', price: 7499 },
    workstation: { title: 'Modular Office Workstation', price: 19999 },
    conference: { title: 'Conference Room Table', price: 26999 }
};
const titleToKey = Object.fromEntries(Object.entries(catalogue).map(([key, item]) => [item.title, key]));
let cart = [];
try { cart = JSON.parse(localStorage.getItem(cartKey) || '[]'); } catch {}

cart = cart.map(entry => {
    if (typeof entry === 'string') return { product: titleToKey[entry], title: entry, quantity: 1 };
    return { product: entry.product || titleToKey[entry.title], title: entry.title, quantity: Math.max(1, Number(entry.quantity) || 1) };
}).filter(entry => entry.product && catalogue[entry.product]);

const money = value => `₹${value.toLocaleString('en-IN')}`;
const shippingCharge = 499;
const saveCart = () => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
};
const renderCart = () => {
    const empty = cart.length === 0;
    document.querySelector('[data-empty-cart]').hidden = !empty;
    document.querySelector('[data-filled-cart]').hidden = empty;
    let subtotal = 0;
    document.querySelectorAll('[data-cart-product]').forEach(row => {
        const key = row.dataset.cartProduct;
        const entry = cart.find(item => item.product === key);
        row.hidden = !entry;
        if (!entry) return;
        const input = row.querySelector('[data-cart-quantity]');
        input.value = entry.quantity;
        const total = catalogue[key].price * entry.quantity;
        subtotal += total;
        row.querySelector('[data-line-total]').textContent = money(total);
    });
    document.querySelector('[data-cart-items-label]').textContent = `(${cart.length} ${cart.length === 1 ? 'item' : 'items'})`;
    document.querySelector('[data-cart-subtotal]').textContent = money(subtotal);
    document.querySelector('[data-cart-total]').textContent = money(empty ? 0 : subtotal + shippingCharge);
};

document.querySelectorAll('[data-cart-plus]').forEach(button => button.addEventListener('click', () => { const item = cart.find(entry => entry.product === button.dataset.cartPlus); if (item) item.quantity += 1; saveCart(); renderCart(); }));
document.querySelectorAll('[data-cart-minus]').forEach(button => button.addEventListener('click', () => { const item = cart.find(entry => entry.product === button.dataset.cartMinus); if (item) item.quantity = Math.max(1, item.quantity - 1); saveCart(); renderCart(); }));
document.querySelectorAll('[data-cart-quantity]').forEach(input => input.addEventListener('change', () => { const item = cart.find(entry => entry.product === input.dataset.cartQuantity); if (item) item.quantity = Math.max(1, Number(input.value) || 1); saveCart(); renderCart(); }));
document.querySelectorAll('[data-remove-cart]').forEach(button => button.addEventListener('click', () => { cart = cart.filter(entry => entry.product !== button.dataset.removeCart); saveCart(); renderCart(); }));
document.querySelector('[data-clear-cart]')?.addEventListener('click', () => { cart = []; saveCart(); renderCart(); });
saveCart();
renderCart();
