/* Product cards are authored in shop.html. This script only filters those cards. */
const filterForm = document.querySelector('[data-product-filters]');
const categorySelect = document.querySelector('[data-category-filter]');
const minimumPriceInput = document.querySelector('[data-min-price]');
const maximumPriceInput = document.querySelector('[data-max-price]');
const orderSelect = document.querySelector('[data-order-filter]');
const productGrid = document.querySelector('.product-grid');
const productCards = [...document.querySelectorAll('.product-card')];
const filterSummary = document.querySelector('[data-filter-summary]');
const catalogueTitle = document.querySelector('[data-catalogue-title]');
const salesRanks = [91, 98, 94, 68, 82, 75, 71, 88, 77, 64, 80, 86];

productCards.forEach((card, index) => {
    card.dataset.sales = String(salesRanks[index]);
});

function applyFilters() {
    const category = categorySelect.value;
    const minimum = Number(minimumPriceInput.value) || 0;
    const maximum = Number(maximumPriceInput.value) || Infinity;
    let visible = 0;

    productCards.forEach(card => {
        const matchesCategory = !category || card.dataset.category.split(' ').includes(category);
        const price = Number(card.dataset.price);
        const matchesPrice = price >= minimum && price <= maximum;
        const showCard = matchesCategory && matchesPrice;
        card.hidden = !showCard;
        if (showCard) visible += 1;
    });

    filterSummary.textContent = visible === productCards.length
        ? `Showing all ${productCards.length} products`
        : `Showing ${visible} of ${productCards.length} products`;

    catalogueTitle.textContent = category
        ? categorySelect.options[categorySelect.selectedIndex].text
        : 'Products';
}

function sortProducts() {
    const order = orderSelect.value;
    const cards = [...productCards];
    const byPrice = (first, second) => Number(first.dataset.price) - Number(second.dataset.price);
    const byPopularity = (first, second) => Number(second.dataset.sales || 0) - Number(first.dataset.sales || 0);

    if (order === 'price-low') cards.sort(byPrice);
    if (order === 'price-high') cards.sort((first, second) => byPrice(second, first));
    if (order === 'best-selling') cards.sort(byPopularity);
    if (order === 'oldest') cards.reverse();
    cards.forEach(card => productGrid.append(card));
}

filterForm?.addEventListener('submit', event => {
    event.preventDefault();
    sortProducts();
    applyFilters();
});

categorySelect?.addEventListener('change', () => {
    catalogueTitle.textContent = categorySelect.value
        ? categorySelect.options[categorySelect.selectedIndex].text
        : 'Products';
});

filterForm?.addEventListener('reset', () => {
    window.setTimeout(() => {
        sortProducts();
        applyFilters();
    }, 0);
});
