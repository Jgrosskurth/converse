/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-featured
 * Base block: columns
 * Source: https://www.converse.com/ - #03-19-hmpg-2-up-cby-shai-sold-out_desktop
 * Structure: 2 columns per row. Each column: image + label + heading + description + CTA(s)
 * Left: Converse By You / THINK IT MAKE IT / Customize
 * Right: SOLD OUT / SHAI 001: BLUSH / Get Notified + Shop All Basketball
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // From captured DOM: two .col-12.col-md-6 divs side by side
  const columns = element.querySelectorAll(':scope > .row > .col-md-6, :scope > div > .col-md-6, .col-12.col-md-6');

  if (columns.length >= 2) {
    const row = [];

    columns.forEach((col) => {
      const cellContent = [];

      // Extract image (from captured DOM: picture > img.modular-tile__img)
      const picture = col.querySelector('picture');
      if (picture) {
        cellContent.push(picture);
      }

      // Extract label text (from captured DOM: .body-type--centi, .body-type--micro-fluid)
      const label = col.querySelector('[class*="body-type--centi"], [class*="body-type--micro"]');
      if (label) {
        const p = document.createElement('p');
        p.textContent = label.textContent.trim().replace(/\u00a0/g, ' ').trim();
        if (p.textContent) cellContent.push(p);
      }

      // Extract heading (from captured DOM: .heading-type--h4-fluid, .heading-type--h3-fluid)
      const heading = col.querySelector('[class*="heading-type"], h1, h2, h3, h4');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim().replace(/\u00a0/g, ' ').trim();
        if (h2.textContent) cellContent.push(h2);
      }

      // Extract description (from captured DOM: p elements not in heading/label)
      const overlayEl = col.querySelector('.modular-tile--overlay');
      if (overlayEl) {
        const descEls = overlayEl.querySelectorAll('p, [class*="body-type--small"]');
        descEls.forEach((desc) => {
          const text = desc.textContent.trim().replace(/\u00a0/g, ' ').trim();
          if (text && text.length > 3) {
            const p = document.createElement('p');
            p.textContent = text;
            cellContent.push(p);
          }
        });
      }

      // Extract CTA links (from captured DOM: a.button, a[class*="button"], .modular-tile__list a)
      const ctaLinks = col.querySelectorAll('a.button, a[class*="button"], .modular-tile__list a');
      const seenHrefs = new Set();
      ctaLinks.forEach((link) => {
        const href = link.href;
        const text = link.textContent.trim().replace(/\u00a0/g, '').trim();
        if (text && !seenHrefs.has(href)) {
          seenHrefs.add(href);
          const a = document.createElement('a');
          a.href = href;
          a.textContent = text;
          cellContent.push(a);
        }
      });

      row.push(cellContent.length > 0 ? cellContent : '');
    });

    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
