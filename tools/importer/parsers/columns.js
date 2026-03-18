/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Source: https://www.academy.com/
 * Handles multiple column patterns:
 * 1. Flex-container deal cards (workwear, fan shop): side-by-side promo cards
 * 2. Rewards section (acc-savings): logo + benefits + CTA
 * 3. Three-column cards (row g-4): app + credit card + text signup
 * Columns block: single row with N columns.
 */

export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Flex-container with flex-items (workwear deals, fan shop)
  const flexItems = element.querySelectorAll('.flex-container > .flex-item');
  if (flexItems.length > 0) {
    const row = [];
    flexItems.forEach((item) => {
      const col = document.createElement('div');
      const link = item.querySelector('a[href]');
      const img = item.querySelector('img');
      const promoText = item.querySelector('.text-card-promo');
      const titleText = item.querySelector('.text-card-title');
      const kickerTexts = item.querySelectorAll('.text-card-kicker');

      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('srcset') || '';
        imgEl.alt = img.alt || '';
        col.append(imgEl);
      }

      if (promoText && promoText.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = promoText.textContent.trim();
        col.append(h3);
      }
      if (titleText && titleText.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = titleText.textContent.trim();
        col.append(p);
      }
      kickerTexts.forEach((kicker) => {
        if (kicker.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = kicker.textContent.trim();
          col.append(p);
        }
      });

      if (link) {
        const a = document.createElement('a');
        a.href = link.href || '#';
        a.textContent = link.getAttribute('aria-label') || 'Shop Now';
        const p = document.createElement('p');
        p.append(a);
        col.append(p);
      }

      row.push(col);
    });

    if (row.length > 0) {
      cells.push(row);
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
      element.replaceWith(block);
    }
    return;
  }

  // Pattern 2: Rewards section (acc-savings)
  const savingsCard = element.querySelector('.acc-savings');
  if (savingsCard) {
    const row = [];

    // Col 1: Logo
    const logoCol = document.createElement('div');
    const logoImg = savingsCard.querySelector('.acc-logo-img');
    if (logoImg) {
      const imgEl = document.createElement('img');
      imgEl.src = logoImg.src || '';
      imgEl.alt = logoImg.alt || '';
      logoCol.append(imgEl);
    }
    const logoCopy = savingsCard.querySelector('.acc-logo-copy');
    if (logoCopy) {
      const p = document.createElement('p');
      p.textContent = logoCopy.textContent.trim();
      logoCol.append(p);
    }
    row.push(logoCol);

    // Col 2: Benefits
    const benefitsCol = document.createElement('div');
    const benefitItems = savingsCard.querySelectorAll('.acc-savings-item:not(.mobile-only):not(.mobile-signed-out)');
    benefitItems.forEach((item) => {
      const icon = item.querySelector('.acc-savings-icon');
      const eyebrow = item.querySelector('.acc-savings-eyebrow');
      const copy = item.querySelector('.acc-savings-copy');

      if (eyebrow) {
        const strong = document.createElement('strong');
        strong.textContent = eyebrow.textContent.trim();
        benefitsCol.append(strong);
        benefitsCol.append(document.createElement('br'));
      }
      if (copy) {
        const span = document.createElement('span');
        span.textContent = copy.textContent.trim();
        benefitsCol.append(span);
        benefitsCol.append(document.createElement('br'));
      }
    });
    row.push(benefitsCol);

    // Col 3: CTA
    const ctaCol = document.createElement('div');
    const joinCta = savingsCard.querySelector('#join-cta');
    if (joinCta) {
      const a = document.createElement('a');
      a.href = joinCta.href || '#';
      a.textContent = joinCta.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      ctaCol.append(p);
    }
    row.push(ctaCol);

    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });

    // Preserve heading
    const heading = element.querySelector('.text-intro-heading-acc');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      element.before(h2);
    }
    element.replaceWith(block);
    return;
  }

  // Pattern 3: Three-column card layout (app/credit/text)
  const colCards = element.querySelectorAll('.col-lg-4');
  if (colCards.length > 0) {
    const row = [];
    colCards.forEach((card) => {
      const col = document.createElement('div');
      const headline = card.querySelector('.headline');
      const subtext = card.querySelector('.subtext');
      const imgs = card.querySelectorAll('img');
      const links = card.querySelectorAll('a[href]');

      if (imgs.length > 0) {
        const imgEl = document.createElement('img');
        imgEl.src = imgs[0].src || '';
        imgEl.alt = imgs[0].alt || '';
        col.append(imgEl);
      }

      if (headline) {
        const h3 = document.createElement('h3');
        h3.textContent = headline.textContent.trim();
        col.append(h3);
      }
      if (subtext) {
        const p = document.createElement('p');
        p.textContent = subtext.textContent.trim();
        col.append(p);
      }

      links.forEach((link) => {
        const a = document.createElement('a');
        a.href = link.href || '#';
        const linkImg = link.querySelector('img');
        if (linkImg) {
          const li = document.createElement('img');
          li.src = linkImg.src || '';
          li.alt = linkImg.alt || '';
          a.append(li);
        } else {
          a.textContent = link.textContent.trim();
        }
        const p = document.createElement('p');
        p.append(a);
        col.append(p);
      });

      // Fine print
      const finePrint = card.querySelector('.fine-print');
      if (finePrint) {
        const p = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = finePrint.textContent.trim();
        p.append(em);
        col.append(p);
      }

      row.push(col);
    });

    if (row.length > 0) {
      cells.push(row);
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
      element.replaceWith(block);
    }
    return;
  }
}
