import { getMetadata } from '../../scripts/aem.js';
import { loadFragment, createFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = await loadFragment(footerPath, `/content${footerPath}.plain.html`);

  // inline fallback when DA content is not available
  if (!fragment) {
    fragment = await createFragment(`<div>
  <h2 id="products">Products</h2>
  <ul>
    <li><a href="https://www.converse.com/shop/mens">Men</a></li>
    <li><a href="https://www.converse.com/shop/womens">Women</a></li>
    <li><a href="https://www.converse.com/shop/kids-shoes">Kids</a></li>
    <li><a href="https://www.converse.com/shop/classic-chuck-shoes">Classic Chuck</a></li>
    <li><a href="https://www.converse.com/shop/chuck-70-shoes">Chuck 70</a></li>
    <li><a href="https://www.converse.com/c/custom">Custom</a></li>
    <li><a href="https://www.converse.com/shop/sale">Sale</a></li>
  </ul>
  <h2 id="help">Help</h2>
  <ul>
    <li><a href="https://www.converse.com/c/help">Help Center</a></li>
    <li><a href="https://www.converse.com/c/order-status">Order Status</a></li>
    <li><a href="https://www.converse.com/c/returns">Returns &amp; Exchanges</a></li>
    <li><a href="https://www.converse.com/c/shipping">Shipping Info</a></li>
    <li><a href="https://www.converse.com/c/contact-us">Contact Us</a></li>
  </ul>
  <h2 id="resources">Resources</h2>
  <ul>
    <li><a href="https://www.converse.com/c/gift-cards">Gift Cards</a></li>
    <li><a href="https://www.converse.com/c/store-finder">Find a Store</a></li>
    <li><a href="https://www.converse.com/c/student-discount">Student Discount</a></li>
    <li><a href="https://www.converse.com/c/military-discount">Military Discount</a></li>
    <li><a href="https://www.converse.com/c/accessibility-statement">Accessibility</a></li>
  </ul>
  <h2 id="company">Company</h2>
  <ul>
    <li><a href="https://www.converse.com/c/about">About</a></li>
    <li><a href="https://www.converse.com/c/news">News</a></li>
    <li><a href="https://www.converse.com/c/sustainability">Sustainability</a></li>
    <li><a href="https://www.converse.com/c/careers">Careers</a></li>
  </ul>
  <h2 id="connect">Connect</h2>
  <ul>
    <li><a href="http://www.instagram.com/converse">Instagram</a></li>
    <li><a href="http://www.twitter.com/converse">Twitter</a></li>
    <li><a href="https://www.youtube.com/c/converse">YouTube</a></li>
    <li><a href="https://www.tiktok.com/@converse">TikTok</a></li>
    <li><a href="https://www.facebook.com/converse">Facebook</a></li>
  </ul>
</div>
<div>
  <p>&copy; 2026 Converse Inc. All Rights Reserved</p>
  <ul>
    <li><a href="https://www.converse.com/c/terms-of-use">Terms of Use</a></li>
    <li><a href="https://www.converse.com/c/privacy-policy">Privacy Policy</a></li>
    <li><a href="https://www.converse.com/c/cookie-policy">Cookie Policy</a></li>
    <li><a href="https://www.converse.com/c/accessibility-statement">Accessibility Statement</a></li>
  </ul>
</div>`);
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // wrap each h2 + ul pair into a column div for grid layout
  const linksSection = footer.querySelector('.section:first-child .default-content-wrapper');
  if (linksSection) {
    const groups = [];
    let current = null;
    [...linksSection.children].forEach((child) => {
      if (child.tagName === 'H2') {
        current = document.createElement('div');
        current.className = 'footer-col';
        current.append(child);
        groups.push(current);
      } else if (current) {
        current.append(child);
      }
    });
    linksSection.textContent = '';
    groups.forEach((g) => linksSection.append(g));
  }

  block.append(footer);
}
