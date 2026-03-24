/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Converse cleanup.
 * Removes non-authorable content from converse.com pages.
 * Selectors from captured DOM of https://www.converse.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent and privacy overlays (from captured DOM: .cookie-policy-modal, #onetrust*)
    WebImporter.DOMUtils.remove(element, [
      '.cookie-policy-modal',
      '[id*="onetrust"]',
      '[class*="cookie"]',
    ]);

    // Remove Klarna payment widgets (from captured DOM: klarna-placement)
    WebImporter.DOMUtils.remove(element, [
      'klarna-placement',
      'klarna-placement-top-strip-promotion-auto-size',
    ]);

    // Remove mobile-only duplicates (from captured DOM: .display--small-only)
    // Keep only desktop versions to avoid duplicate content
    WebImporter.DOMUtils.remove(element, [
      '.display--small-only',
    ]);

    // Remove slick carousel cloned slides (from captured DOM: .slick-cloned)
    WebImporter.DOMUtils.remove(element, [
      '.slick-cloned',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header/navigation (from captured DOM: .header-container, .global-container.scope-header)
    WebImporter.DOMUtils.remove(element, [
      '.header-container',
      '.global-container.scope-header',
      '.header-content-wrapper',
    ]);

    // Remove footer (from captured DOM: .footer, .footer-item--accordions)
    WebImporter.DOMUtils.remove(element, [
      '.footer',
      '.footer-item--accordions',
    ]);

    // Remove global promo banner carousel (from captured DOM: .global-promo-banner)
    WebImporter.DOMUtils.remove(element, [
      '.global-promo-banner',
    ]);

    // Remove skip navigation links (from captured DOM: .skip-to-main--container)
    WebImporter.DOMUtils.remove(element, [
      '.skip-to-main--container',
    ]);

    // Remove recommendation slots (from captured DOM: [id*="cq_recomm_slot"])
    WebImporter.DOMUtils.remove(element, [
      '[id*="cq_recomm_slot"]',
    ]);

    // Remove various widgets and non-authorable elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'svg',
      '#browser-check',
      '.back-to-top',
      '[id*="batBeacon"]',
    ]);

    // Clean data attributes from all elements
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-tracking-cms-module');
      el.removeAttribute('data-slick-index');
      el.removeAttribute('data-carousel-config');
      el.removeAttribute('data-motion-trigger-ready');
      el.removeAttribute('onclick');
    });
  }
}
