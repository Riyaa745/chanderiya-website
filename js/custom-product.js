document.querySelector('[data-custom-enquiry]')?.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const message = `Hello Chanderiya Marketing & Sales,\n\nI would like a quotation for a Custom Executive Desk.\n\nSize: ${values.get('size')}\nFinish: ${values.get('finish')}\nQuantity: ${values.get('quantity')}\nRequirement: ${values.get('requirement') || 'Not specified'}`;
    window.open(`https://wa.me/919027398484?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

const galleryImage = document.querySelector('.main-product-image img');
const thumbnails = [...document.querySelectorAll('[data-gallery-thumbnail]')];
const galleryImages = thumbnails.map(button => ({ src: button.querySelector('img').src, alt: button.querySelector('img').alt }));
let galleryIndex = 0;

const showGalleryImage = index => {
    if (!galleryImage || !galleryImages.length) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    galleryImage.src = galleryImages[galleryIndex].src;
    galleryImage.alt = galleryImages[galleryIndex].alt;
    thumbnails.forEach((thumbnail, position) => thumbnail.classList.toggle('active', position === galleryIndex));
};

thumbnails.forEach(button => button.addEventListener('click', () => showGalleryImage(Number(button.dataset.galleryThumbnail))));
document.querySelector('[data-gallery-previous]')?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
document.querySelector('[data-gallery-next]')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
