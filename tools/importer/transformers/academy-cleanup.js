/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Academy.com cleanup.
 * Removes non-authorable content from the page DOM.
 * Selectors from captured DOM of https://www.academy.com/
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Remove cookie consent
    WebImporter.DOMUtils.remove(element, ['.cc-revoke', '.cc-window']);

    // Remove header components
    WebImporter.DOMUtils.remove(element, [
      '[data-component="header240"]',
      '.siteHeader--JF7gf',
      '#nextGenHeader240',
    ]);

    // Remove app install panel
    WebImporter.DOMUtils.remove(element, ['[data-component="installAppPanel220"]']);

    // Remove hidden elements
    WebImporter.DOMUtils.remove(element, ['[hidden]', '[style*="display:none"]', '[style*="display: none"]']);

    // Remove personalization/recommendation empty containers
    WebImporter.DOMUtils.remove(element, ['[data-cname="mt_pzwidget_rec"]']);

    // Remove fit clinic banner (hidden)
    WebImporter.DOMUtils.remove(element, ['#fit-clinic-banner']);

    // Remove scroll buttons
    WebImporter.DOMUtils.remove(element, ['.css-scroll-btn']);

    // Remove carousel controls (prev/next buttons, indicators)
    WebImporter.DOMUtils.remove(element, [
      '.carousel-indicators',
      '.indicator-wrapper',
      '.carousel-control-prev',
      '.carousel-control-next',
    ]);
  }

  if (hookName === 'afterTransform') {
    // Remove footer
    WebImporter.DOMUtils.remove(element, [
      '[data-component="footer240"]',
      '.footer-container',
    ]);

    // Remove link and noscript elements
    WebImporter.DOMUtils.remove(element, ['link', 'noscript']);

    // Remove video elements (NCAA video, etc.)
    WebImporter.DOMUtils.remove(element, ['video', '.video-control-button']);

    // Remove disclaimer text
    WebImporter.DOMUtils.remove(element, ['.text-disclaimer', '.acc-disclaimer']);

    // Clean empty divs
    const emptyDivs = element.querySelectorAll('div:empty');
    emptyDivs.forEach((div) => {
      if (!div.id && !div.className) div.remove();
    });
  }
}
