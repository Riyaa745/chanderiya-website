document.querySelectorAll('.custom-card').forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.addEventListener('click', event => {
        if (event.target.closest('a')) return;
        window.location.href = 'custom-product.html';
    });
    card.addEventListener('keydown', event => {
        if (event.key === 'Enter') window.location.href = 'custom-product.html';
    });
});
