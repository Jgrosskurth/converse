/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Source: https://www.academy.com/
 * Handles multiple card patterns:
 * 1. Product carousels (mt-merch-item): image + title cards
 * 2. Brand/shoe image cards (scrollable-card links): linked images
 * 3. Service feature cards (info-feature-item): icon + heading + desc + link
 * Cards block: each row = 1 card. Col 1 = image, Col 2 = text content.
 */

export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Product carousel (mt-merch-item)
  const merchItems = element.querySelectorAll('.mt-merch-item');
  if (merchItems.length > 0) {
    merchItems.forEach((item) => {
      const link = item.querySelector('.mt-link');
      const img = item.querySelector('.mt-image');
      const title = item.querySelector('.mt-title');

      const imgCol = document.createElement('div');
      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('srcset') || '';
        imgEl.alt = img.alt || '';
        if (link) {
          const a = document.createElement('a');
          a.href = link.href || '#';
          a.append(imgEl);
          imgCol.append(a);
        } else {
          imgCol.append(imgEl);
        }
      }

      const contentCol = document.createElement('div');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        contentCol.append(h3);
      }

      if (imgCol.childNodes.length || contentCol.childNodes.length) {
        cells.push([imgCol, contentCol]);
      }
    });

    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });

    // Preserve heading above the block (e.g., "Today's Styles")
    const header = element.querySelector('.mt-header h2');
    const shopAll = element.querySelector('.mt-shop-all');
    if (header) {
      const h2 = document.createElement('h2');
      h2.textContent = header.textContent.trim();
      element.before(h2);
      if (shopAll) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = shopAll.href || '#';
        a.textContent = shopAll.textContent.trim();
        p.append(a);
        h2.after(p);
      }
    }
    element.replaceWith(block);
    return;
  }

  // Pattern 2: Scrollable brand/shoe cards
  const scrollCards = element.querySelectorAll('.scrollable-card');
  if (scrollCards.length > 0) {
    scrollCards.forEach((card) => {
      const img = card.querySelector('img:not(.gift-wrapper img)');
      const href = card.href || card.getAttribute('href');
      const label = card.getAttribute('aria-label') || '';

      const imgCol = document.createElement('div');
      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('srcset') || '';
        imgEl.alt = img.alt || '';
        imgCol.append(imgEl);
      }

      const contentCol = document.createElement('div');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label || 'Shop Now';
        const p = document.createElement('p');
        p.append(a);
        contentCol.append(p);
      }

      if (imgCol.childNodes.length || contentCol.childNodes.length) {
        cells.push([imgCol, contentCol]);
      }
    });

    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: Service feature cards (info-feature-item)
  const featureItems = element.querySelectorAll('.info-feature-item');
  if (featureItems.length > 0) {
    featureItems.forEach((item) => {
      const icon = item.querySelector('.info-icon');
      const heading = item.querySelector('.info-heading');
      const desc = item.querySelector('.info-description');
      const links = item.querySelectorAll('.info-link');

      const imgCol = document.createElement('div');
      if (icon) {
        const imgEl = document.createElement('img');
        imgEl.src = icon.src || '';
        imgEl.alt = icon.alt || '';
        imgCol.append(imgEl);
      }

      const contentCol = document.createElement('div');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        contentCol.append(h3);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentCol.append(p);
      }
      links.forEach((link) => {
        const a = document.createElement('a');
        a.href = link.href || '#';
        a.textContent = link.textContent.trim();
        const p = document.createElement('p');
        p.append(a);
        contentCol.append(p);
      });

      if (imgCol.childNodes.length || contentCol.childNodes.length) {
        cells.push([imgCol, contentCol]);
      }
    });

    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 4: Generic linked image cards (flex-item or simple cards)
  const cardLinks = element.querySelectorAll('a[href]');
  if (cardLinks.length > 0) {
    cardLinks.forEach((link) => {
      const img = link.querySelector('img');
      if (!img) return;

      const imgCol = document.createElement('div');
      const imgEl = document.createElement('img');
      imgEl.src = img.src || img.getAttribute('srcset') || '';
      imgEl.alt = img.alt || '';
      imgCol.append(imgEl);

      const contentCol = document.createElement('div');
      const label = link.getAttribute('aria-label') || img.alt || '';
      if (label) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href || '#';
        a.textContent = label;
        p.append(a);
        contentCol.append(p);
      }

      cells.push([imgCol, contentCol]);
    });

    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
    element.replaceWith(block);
  }
}
