/* ==========================================
   Contact Quote Form
========================================== */
document.querySelectorAll('[data-quote-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = `Hello Chanderiya Marketing & Sales,\n\nName: ${data.get('name')}\nOrganization: ${data.get('organization') || 'Not specified'}\nPhone: ${data.get('phone')}\nLocation: ${data.get('location') || 'Not specified'}\nInterested in: ${data.get('interest')}\n\nRequirement:\n${data.get('message')}`;
    window.open(`https://wa.me/919027398484?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}));
