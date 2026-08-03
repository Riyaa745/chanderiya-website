let account = {};
try { account = JSON.parse(localStorage.getItem('chanderiya-account') || '{}'); } catch {}
account = { name: account.name || 'Customer', email: account.email || 'customer@example.com', phone: account.phone || '', organization: account.organization || 'Not provided' };
const dashboardProducts = { desk: 'Premium Executive Desk', chair: 'Ergonomic Mesh Chair', workstation: 'Modular Office Workstation', conference: 'Conference Room Table' };
const readWishlist = () => { try { return JSON.parse(localStorage.getItem('chanderiya-wishlist') || '[]'); } catch { return []; } };
const renderDashboardWishlist = () => {
    const wishlist = readWishlist().filter(key => dashboardProducts[key]);
    document.querySelectorAll('[data-profile-wishlist-count]').forEach(item => item.textContent = wishlist.length);
    document.querySelectorAll('[data-profile-wishlist-product]').forEach(card => card.hidden = !wishlist.includes(card.dataset.profileWishlistProduct));
    document.querySelector('[data-profile-wishlist-empty]').hidden = wishlist.length !== 0;
    document.querySelector('[data-profile-wishlist-grid]').hidden = wishlist.length === 0;
};
const fillProfile = () => {
    document.querySelectorAll('[data-profile-name]').forEach(item => item.textContent = account.name);
    document.querySelectorAll('[data-profile-first-name]').forEach(item => item.textContent = account.name.split(' ')[0]);
    document.querySelectorAll('[data-profile-email]').forEach(item => item.textContent = account.email);
    document.querySelectorAll('[data-profile-organization]').forEach(item => item.textContent = account.organization || 'Not provided');
    document.querySelector('[data-profile-initial]').textContent = account.name.charAt(0).toUpperCase();
    document.querySelector('[data-profile-input-name]').value = account.name;
    document.querySelector('[data-profile-input-email]').value = account.email;
    document.querySelector('[data-profile-input-phone]').value = account.phone;
    document.querySelector('[data-profile-input-organization]').value = account.organization === 'Not provided' ? '' : account.organization;
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('chanderiya-inquiry') || '[]'); } catch {}
    document.querySelectorAll('[data-profile-cart-count]').forEach(item => item.textContent = cart.length);
    renderDashboardWishlist();
};
const openPanel = name => {
    document.querySelectorAll('[data-dashboard-panel]').forEach(panel => panel.hidden = panel.dataset.dashboardPanel !== name);
    document.querySelectorAll('[data-dashboard-tab]').forEach(button => button.classList.toggle('active', button.dataset.dashboardTab === name));
    scrollTo({ top: document.querySelector('.dashboard-area').offsetTop - 90, behavior: 'smooth' });
};
document.querySelectorAll('[data-dashboard-tab]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.dashboardTab)));
document.querySelectorAll('[data-open-tab]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); openPanel(button.dataset.openTab); }));
document.querySelectorAll('[data-profile-wishlist-remove]').forEach(button => button.addEventListener('click', () => {
    const wishlist = readWishlist().filter(key => key !== button.dataset.profileWishlistRemove);
    localStorage.setItem('chanderiya-wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlist-updated'));
    renderDashboardWishlist();
}));
document.querySelectorAll('[data-profile-wishlist-cart]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.profileWishlistCart;
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('chanderiya-inquiry') || '[]'); } catch {}
    const exists = cart.some(item => (typeof item === 'string' ? item === dashboardProducts[key] : item.product === key || item.title === dashboardProducts[key]));
    if (!exists) cart.push({ product: key, title: dashboardProducts[key], quantity: 1 });
    localStorage.setItem('chanderiya-inquiry', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    fillProfile();
    button.classList.add('added');
    button.lastChild.textContent = ' Added';
}));
document.querySelector('[data-profile-form]')?.addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.currentTarget); account = { ...account, name: data.get('name'), email: data.get('email'), phone: data.get('phone'), organization: data.get('organization') }; localStorage.setItem('chanderiya-account', JSON.stringify(account)); fillProfile(); document.querySelector('[data-profile-status]').textContent = 'Your account details have been saved.'; });
document.querySelector('[data-logout]')?.addEventListener('click', () => { localStorage.removeItem('chanderiya-account'); location.href = 'login.html'; });
fillProfile();
