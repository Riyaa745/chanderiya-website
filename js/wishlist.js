const wishlistKey = 'chanderiya-wishlist';
const cartKey = 'chanderiya-inquiry';
const products = { desk: 'Premium Executive Desk', chair: 'Ergonomic Mesh Chair', workstation: 'Modular Office Workstation', conference: 'Conference Room Table' };
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]'); } catch {}
wishlist = wishlist.filter(key => products[key]);

const saveWishlist = () => { localStorage.setItem(wishlistKey, JSON.stringify(wishlist)); window.dispatchEvent(new Event('wishlist-updated')); };
const renderWishlist = () => {
    const empty = wishlist.length === 0;
    document.querySelector('[data-empty-wishlist]').hidden = !empty;
    document.querySelector('[data-filled-wishlist]').hidden = empty;
    document.querySelectorAll('[data-wishlist-product]').forEach(card => card.hidden = !wishlist.includes(card.dataset.wishlistProduct));
    document.querySelector('[data-wishlist-count]').textContent = `(${wishlist.length} ${wishlist.length === 1 ? 'product' : 'products'})`;
};
const readCart = () => { try { return JSON.parse(localStorage.getItem(cartKey) || '[]'); } catch { return []; } };
const addToCart = key => {
    const cart = readCart();
    const exists = cart.some(entry => (typeof entry === 'string' ? entry : entry.product === key || entry.title === products[key]));
    if (!exists) cart.push({ product: key, title: products[key], quantity: 1 });
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
};
document.querySelectorAll('[data-remove-wishlist]').forEach(button => button.addEventListener('click', () => { wishlist = wishlist.filter(key => key !== button.dataset.removeWishlist); saveWishlist(); renderWishlist(); }));
document.querySelectorAll('[data-wishlist-cart]').forEach(button => button.addEventListener('click', () => { addToCart(button.dataset.wishlistCart); button.classList.add('added'); button.querySelector('i').className = 'bi bi-check2'; button.lastChild.textContent = ' Added to cart'; }));
document.querySelector('[data-clear-wishlist]')?.addEventListener('click', () => { wishlist = []; saveWishlist(); renderWishlist(); });
document.querySelector('[data-add-all-cart]')?.addEventListener('click', () => wishlist.forEach(addToCart));
saveWishlist();
renderWishlist();
