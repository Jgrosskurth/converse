export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-featured-img-col');
        }
      }

      // force line break in headings like "THINK IT,MAKE IT."
      const h2 = col.querySelector('h2');
      if (h2 && h2.textContent.includes(',')) {
        const parts = h2.textContent.split(',');
        h2.innerHTML = `${parts[0]},<br>${parts.slice(1).join(',')}`;
      }

      // wrap CTA link paragraphs into an inline row
      const ctaLinks = col.querySelectorAll(':scope > p:has(a)');
      if (ctaLinks.length > 1) {
        const ctaRow = document.createElement('div');
        ctaRow.className = 'columns-featured-ctas';
        ctaLinks[0].before(ctaRow);
        ctaLinks.forEach((p) => ctaRow.append(p));
      }

      // wrap customize CTA text in span for gradient effect
      const customizeLink = col.querySelector('a[href*="custom"]');
      if (customizeLink) {
        const text = customizeLink.textContent.trim();
        customizeLink.innerHTML = `<span class="gradient-text">${text}</span>`;
      }
    });
  });
}
