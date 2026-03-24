/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-editorial
 * Base block: hero
 * Source: https://www.converse.com/ - #03-19-hmpg-converse-color_desktop
 * Structure: 1 column, row 1 = background image, row 2 = heading + text + CTA
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image
  // From captured DOM: picture > img.modular-tile__img inside .modular-tile--media
  const bgImage = element.querySelector('picture img.modular-tile__img, picture img[class*="modular-tile__img"]');
  if (bgImage) {
    const picture = bgImage.closest('picture');
    cells.push([picture || bgImage]);
  }

  // Row 2: Content - heading + description + CTA
  // From captured DOM: .modular-tile--overlay contains text content
  const overlay = element.querySelector('.modular-tile--overlay');
  const contentCell = [];

  if (overlay) {
    // Extract heading (from captured DOM: .heading-type--h4-fluid or similar)
    const headingEl = overlay.querySelector('[class*="heading-type"], h1, h2, h3, h4');
    if (headingEl) {
      const h2 = document.createElement('h2');
      h2.textContent = headingEl.textContent.trim();
      contentCell.push(h2);
    }

    // Extract description text (from captured DOM: .body-type--micro-fluid)
    const descEl = overlay.querySelector('[class*="body-type--micro"], [class*="body-type--small"], p');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentCell.push(p);
    }

    // Extract CTA links (from captured DOM: .modular-tile__list a, a.button)
    const ctaLinks = overlay.querySelectorAll('.modular-tile__list a, a.button, a[class*="button"]');
    ctaLinks.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim().replace(/\u00a0/g, '').trim() || 'Shop';
      contentCell.push(a);
    });
  }

  // Fallback: extract links from the section
  if (contentCell.length === 0) {
    const allLinks = element.querySelectorAll('a[href*="/shop/"]');
    if (allLinks.length > 0) {
      const a = document.createElement('a');
      a.href = allLinks[0].href;
      a.textContent = 'Shop';
      contentCell.push(a);
    }
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-editorial', cells });
  element.replaceWith(block);
}
