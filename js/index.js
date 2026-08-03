/* ==========================================
   Hero Slider
========================================== */
const slider = document.querySelector('[data-hero-slider]');
if (slider) {
    const slides = [...slider.querySelectorAll('.hero-slide')];
    const dots = [...slider.querySelectorAll('[data-slide]')];
    let active = 0;
    let timer;
    const show = index => {
        active = (index + slides.length) % slides.length;
        slides.forEach((slide, position) => slide.classList.toggle('active', position === active));
        dots.forEach((dot, position) => dot.classList.toggle('active', position === active));
    };
    const autoplay = () => {
        clearInterval(timer);
        timer = setInterval(() => show(active + 1), 5000);
    };
    slider.querySelector('[data-slider-prev]')?.addEventListener('click', () => { show(active - 1); autoplay(); });
    slider.querySelector('[data-slider-next]')?.addEventListener('click', () => { show(active + 1); autoplay(); });
    dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.slide)); autoplay(); }));
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', autoplay);
    show(0);
    autoplay();
}

/* ==========================================
   Customer Logo Marquee
========================================== */
/* ==========================================
   Featured Products - Wishlist and Cart
========================================== */
const featuredProductKeys = ['desk', 'chair', 'workstation', 'conference'];
document.querySelectorAll('#featured-products .commerce-card').forEach((card, index) => {
    const destination = `product.html?product=${featuredProductKeys[index]}`;
    card.querySelectorAll('a[href]').forEach(link => {
        link.href = destination;
    });
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.addEventListener('click', event => {
        if (!event.target.closest('a, button')) location.href = destination;
    });
    card.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.target.closest('a, button')) location.href = destination;
    });
});

const cartStorageKey = 'chanderiya-inquiry';
let homeCart = [];
try { homeCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]'); } catch {}

document.querySelectorAll('[data-add-item]').forEach(button => button.addEventListener('click', () => {
    const item = button.dataset.addItem;
    if (!homeCart.includes(item)) homeCart.push(item);
    localStorage.setItem(cartStorageKey, JSON.stringify(homeCart));
    window.dispatchEvent(new Event('cart-updated'));
    const original = button.textContent;
    button.textContent = 'Added ✓';
    button.classList.add('added');
    setTimeout(() => {
        button.textContent = original;
        button.classList.remove('added');
    }, 1500);
}));

document.querySelectorAll('.wishlist-button').forEach(button => button.addEventListener('click', () => {
    const active = button.classList.toggle('active');
    const icon = button.querySelector('i');
    icon?.classList.toggle('bi-heart', !active);
    icon?.classList.toggle('bi-heart-fill', active);
    button.setAttribute('aria-pressed', String(active));
}));

/* ==========================================
   Scroll Reveal
========================================== */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    }), { threshold: .12 });
    reveals.forEach(element => observer.observe(element));
} else {
    reveals.forEach(element => element.classList.add('visible'));
}
