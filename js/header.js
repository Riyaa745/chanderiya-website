/* Shared header navigation only. */
const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

document.querySelectorAll('.main-nav a,.mobile-nav a').forEach(link => {
    const target = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
    link.classList.toggle('active', target === currentPage);
});

document.querySelectorAll('.mobile-menu-toggle').forEach(button => {
    const menu = button.nextElementSibling;
    button.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        button.classList.toggle('open', open);
        button.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        menu.classList.remove('open');
        button.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
    }));
});

window.updateHeaderCartCount = () => {
    let count = 0;
    try { count = JSON.parse(localStorage.getItem('chanderiya-inquiry') || '[]').length; } catch {}
    document.querySelectorAll('[data-cart-count]').forEach(element => element.textContent = count);
};
window.updateHeaderCartCount();
window.addEventListener('cart-updated', window.updateHeaderCartCount);

window.updateHeaderWishlistCount = () => {
    let count = 0;
    try { count = JSON.parse(localStorage.getItem('chanderiya-wishlist') || '[]').length; } catch {}
    document.querySelectorAll('[data-wishlist-count-header]').forEach(element => element.textContent = count);
};
window.updateHeaderWishlistCount();
window.addEventListener('wishlist-updated', window.updateHeaderWishlistCount);

const searchPopup = document.querySelector('[data-search-popup]');
const searchField = searchPopup?.querySelector('[data-popup-search-input]');
const searchResults = [...(searchPopup?.querySelectorAll('[data-popup-search-product]') || [])];
const filterPopupSearch = () => {
    const query = (searchField?.value || '').trim().toLowerCase();
    let visible = 0;
    searchResults.forEach(result => {
        const match = !query || result.dataset.searchText.toLowerCase().includes(query);
        result.hidden = !match;
        if (match) visible += 1;
    });
    const empty = searchPopup?.querySelector('[data-popup-search-empty]');
    if (empty) empty.hidden = visible !== 0;
};
const openSearchPopup = () => {
    if (!searchPopup) return;
    searchPopup.hidden = false;
    document.body.classList.add('no-scroll');
    searchField?.focus();
    filterPopupSearch();
};
const closeSearchPopup = () => {
    if (!searchPopup) return;
    searchPopup.hidden = true;
    document.body.classList.remove('no-scroll');
};
document.addEventListener('click', event => {
    if (event.target.closest('[data-search-open]')) { event.preventDefault(); openSearchPopup(); }
    if (event.target.closest('[data-search-close]')) closeSearchPopup();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && searchPopup && !searchPopup.hidden) closeSearchPopup(); });
searchField?.addEventListener('input', filterPopupSearch);
searchPopup?.querySelector('[data-popup-search-form]')?.addEventListener('submit', event => event.preventDefault());

/* Header enquiry modal. */
const headerEnquiryModal = document.querySelector('[data-enquiry-modal]');
let modalTrigger = null;

const openHeaderEnquiry = trigger => {
    if (!headerEnquiryModal) return;
    modalTrigger = trigger;
    headerEnquiryModal.classList.add('open');
    headerEnquiryModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    headerEnquiryModal.querySelector('input')?.focus();
};

const closeHeaderEnquiry = () => {
    if (!headerEnquiryModal) return;
    headerEnquiryModal.classList.remove('open');
    headerEnquiryModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    modalTrigger?.focus();
};

document.addEventListener('click', event => {
    const openButton = event.target.closest('.site-header .nav-cta, .site-header .mobile-nav .button');
    if (openButton) {
        event.preventDefault();
        openHeaderEnquiry(openButton);
        return;
    }
    if (event.target.closest('[data-enquiry-close]')) closeHeaderEnquiry();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && headerEnquiryModal?.classList.contains('open')) {
        closeHeaderEnquiry();
    }
});

document.querySelector('[data-header-quote-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hello Chanderiya Marketing & Sales,\n\nName: ${data.get('name')}\nOrganization: ${data.get('organization') || 'Not specified'}\nPhone: ${data.get('phone')}\nLocation: ${data.get('location') || 'Not specified'}\nInterested in: ${data.get('interest')}\n\nRequirement:\n${data.get('message')}`;
    window.open(`https://wa.me/919027398484?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
