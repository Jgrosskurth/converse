/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-categories
 * Base block: carousel
 * Source: https://www.converse.com/ - .featured-carousel
 * Structure: 2 columns per row. Col 1 = image, Col 2 = heading + optional CTA link
 * Slides: High Tops, Low Tops, Platforms, Custom
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // From captured DOM: .featured-carousel contains slides with images and title links
  // Each slide has: picture img (D-Converse-Homepage-P2A-High-Tops.jpg etc.)
  // and title text in .featured-carousel__slide-title__single

  // Find all slide images (from captured DOM: picture elements with Homepage P2 images)
  const slideImages = element.querySelectorAll('picture');
  const slideTitles = element.querySelectorAll('.featured-carousel__slide-title__single');
  const slideLinks = element.querySelectorAll('a[href*="/shop/"]');

  // Build a mapping of slides from the available data
  // From captured DOM structure, the carousel has image slides and corresponding title links
  const uniqueLinks = [];
  const seenHrefs = new Set();
  slideLinks.forEach((link) => {
    const href = link.href;
    if (!seenHrefs.has(href)) {
      seenHrefs.add(href);
      uniqueLinks.push(link);
    }
  });

  // Match images to titles/links
  const slideCount = Math.max(slideImages.length, slideTitles.length, uniqueLinks.length);

  for (let i = 0; i < slideCount; i++) {
    const imgCell = [];
    const contentCell = [];

    // Image cell
    if (slideImages[i]) {
      const picture = slideImages[i];
      imgCell.push(picture);
    }

    // Content cell: title heading + link
    if (slideTitles[i]) {
      const h2 = document.createElement('h2');
      h2.textContent = slideTitles[i].textContent.trim();
      contentCell.push(h2);
    }

    if (uniqueLinks[i]) {
      const a = document.createElement('a');
      a.href = uniqueLinks[i].href;
      a.textContent = uniqueLinks[i].textContent.trim() || 'Shop';
      contentCell.push(a);
    }

    if (imgCell.length > 0 || contentCell.length > 0) {
      cells.push([imgCell.length > 0 ? imgCell : '', contentCell.length > 0 ? contentCell : '']);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-categories', cells });
  element.replaceWith(block);
}
