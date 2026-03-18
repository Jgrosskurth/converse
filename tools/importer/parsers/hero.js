/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Source: https://www.academy.com/
 * Extracts hero carousel slides with linked images.
 * Hero block: each row = one slide. Col 1 = linked image.
 */

export default function parse(element, { document }) {
  // Find carousel items
  const items = element.querySelectorAll('.carousel-item');
  if (!items.length) {
    // Fallback: hero banner with text overlay (e.g., baseball section)
    const link = element.querySelector('a[href]');
    const picture = element.querySelector('picture');
    if (!link || !picture) return;

    const cells = [];
    const contentDiv = document.createElement('div');

    // Extract overlay text
    const promoText = element.querySelector('.text-card-promo');
    const titleText = element.querySelector('.text-card-title');
    const ctaText = element.querySelector('.text-card-cta');

    // Clone picture for image row
    const img = picture.querySelector('img');
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src || img.getAttribute('srcset') || '';
      imgEl.alt = img.alt || '';
      cells.push([imgEl]);
    }

    if (promoText && promoText.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = promoText.textContent.trim();
      contentDiv.append(h2);
    }
    if (titleText && titleText.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = titleText.textContent.trim();
      contentDiv.append(p);
    }
    if (ctaText && ctaText.textContent.trim()) {
      const a = document.createElement('a');
      a.href = link.href || '#';
      a.textContent = ctaText.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      contentDiv.append(p);
    } else if (link.getAttribute('aria-label')) {
      const a = document.createElement('a');
      a.href = link.href || '#';
      a.textContent = link.getAttribute('aria-label');
      const p = document.createElement('p');
      p.append(a);
      contentDiv.append(p);
    }

    if (contentDiv.childNodes.length > 0) cells.push([contentDiv]);

    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
    element.replaceWith(block);
    return;
  }

  // Carousel hero: each slide is a row with linked image
  const cells = [];
  items.forEach((item) => {
    const link = item.querySelector('a');
    const img = item.querySelector('img');
    if (!img) return;

    const imgEl = document.createElement('img');
    imgEl.src = img.src || img.getAttribute('srcset') || '';
    imgEl.alt = img.alt || '';

    if (link) {
      const a = document.createElement('a');
      a.href = link.href || '#';
      a.append(imgEl);
      cells.push([a]);
    } else {
      cells.push([imgEl]);
    }
  });

  if (cells.length === 0) return;
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
