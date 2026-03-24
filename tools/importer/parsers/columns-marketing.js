/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-marketing
 * Base block: columns
 * Source: https://www.converse.com/ - .marketing-tiles
 * Structure: 4 columns per row. Each column: icon + heading + description + CTA link
 * Col 1: Fast Free Shipping, Col 2: Worry-Free Returns, Col 3: Gift Cards, Col 4: Follow Us
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // From captured DOM: .marketing-tiles__col.col-6.col-md-3 divs (4 columns)
  const columns = element.querySelectorAll('.marketing-tiles__col, .col-md-3');
  const row = [];

  columns.forEach((col) => {
    const cellContent = [];

    // Extract icon/image (from captured DOM: .marketing-tiles__item-icon or svg)
    const icon = col.querySelector('.marketing-tiles__item-icon__wrapper, .marketing-tiles__item-icon, picture, img');
    if (icon) {
      // For SVG icons, create a placeholder description
      const iconEl = col.querySelector('svg, img');
      if (iconEl && iconEl.tagName === 'IMG') {
        cellContent.push(iconEl);
      }
    }

    // Extract title (from captured DOM: .marketing-tiles__item-title)
    const title = col.querySelector('.marketing-tiles__item-title, [class*="item-title"]');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      cellContent.push(h3);
    }

    // Extract description (from captured DOM: .marketing-tiles__item-description)
    const desc = col.querySelector('.marketing-tiles__item-description, [class*="item-description"]');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      cellContent.push(p);
    }

    // Extract CTA link (from captured DOM: .marketing-tiles__item-link, a.link--underline)
    const link = col.querySelector('.marketing-tiles__item-link, a[class*="link--underline"]');
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim().replace(/\u00a0/g, '').trim() || 'Learn More';
      cellContent.push(a);
    }

    // Handle social media links column (from captured DOM: social icons in last column)
    const socialLinks = col.querySelectorAll('a[href*="instagram"], a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], a[href*="tiktok"]');
    if (socialLinks.length > 0) {
      socialLinks.forEach((social) => {
        const a = document.createElement('a');
        a.href = social.href;
        a.textContent = social.textContent.trim() || social.getAttribute('aria-label') || 'Follow';
        cellContent.push(a);
      });
    }

    if (cellContent.length > 0) {
      row.push(cellContent);
    }
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-marketing', cells });
  element.replaceWith(block);
}
