const ICONS = {
  'Fast, Free Shipping': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  'Worry-Free Returns': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
  'Converse Gift Cards': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8V21"/><path d="M3 12h18"/><path d="M12 8c-2-3-6-3-6 0s4 3 6 0"/><path d="M12 8c2-3 6-3 6 0s-4 3-6 0"/></svg>',
  'Follow Us': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
};

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
          picWrapper.classList.add('columns-marketing-img-col');
        }
      }

      // inject icons above h3 headings
      const h3 = col.querySelector('h3');
      if (h3) {
        const title = h3.textContent.trim();
        const svg = ICONS[title];
        if (svg) {
          const iconEl = document.createElement('div');
          iconEl.className = 'columns-marketing-icon';
          iconEl.innerHTML = svg;
          h3.parentNode.insertBefore(iconEl, h3);
        }
      }
    });
  });
}
