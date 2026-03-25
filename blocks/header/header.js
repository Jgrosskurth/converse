import { getMetadata } from '../../scripts/aem.js';
import { loadFragment, createFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let fragment = await loadFragment(navPath, `/content${navPath}.plain.html`);

  // inline fallback when DA content is not available
  if (!fragment) {
    fragment = await createFragment(`<div>
  <p><a href="/"><img src="/icons/logo.png" alt="Converse" class="converse-logo" width="200" height="30"></a></p>
</div>
<div>
  <ul>
    <li><a href="https://www.converse.com/shop/new-arrivals">New &amp; Featured</a></li>
    <li><a href="https://www.converse.com/shop/womens">Women</a></li>
    <li><a href="https://www.converse.com/shop/mens">Men</a></li>
    <li><a href="https://www.converse.com/shop/kids-shoes">Kids</a></li>
    <li><a href="https://www.converse.com/c/custom">Custom</a></li>
    <li><a href="https://www.converse.com/shop/launch">Launch</a></li>
    <li><a href="https://www.converse.com/shop/sale">Sale</a></li>
  </ul>
</div>
<div>
  <p><a href="https://www.converse.com/search">Search</a></p>
  <p><a href="https://www.converse.com/favorites">Favorites</a></p>
  <p><a href="https://www.converse.com/cart">Cart</a></p>
</div>`);
  }

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // replace brand text/SVG with logo PNG image
  const brandAnchor = navBrand.querySelector('a');
  if (brandAnchor && !brandAnchor.querySelector('img.converse-logo')) {
    const logoImg = document.createElement('img');
    logoImg.src = '/icons/logo.png';
    logoImg.alt = 'Converse';
    logoImg.className = 'converse-logo';
    logoImg.width = 200;
    logoImg.height = 30;
    brandAnchor.textContent = '';
    brandAnchor.appendChild(logoImg);
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // single top bar: locale left, promo center, help/signin right
  const topBar = document.createElement('div');
  topBar.className = 'top-bar';
  const promos = [
    'Free Shipping on Orders $75+ | <a href="https://www.converse.com/shop/new-arrivals">Shop New Arrivals</a>',
    'Members Get 25% Off Select Styles | <a href="https://www.converse.com/#">Join Now</a>',
    'Easy Returns Within 30 Days | <a href="https://www.converse.com/c/returns">Learn More</a>',
  ];
  topBar.innerHTML = `<div class="top-bar-inner">
    <div class="top-bar-left">
      <span class="top-bar-flag">🇺🇸</span>
      <span class="top-bar-locale">US</span>
      <span class="top-bar-sep">|</span>
      <span class="top-bar-lang">EN</span>
    </div>
    <div class="top-bar-center">${promos.map((p, i) => `<p class="top-bar-promo${i === 0 ? ' active' : ''}">${p}</p>`).join('')}</div>
    <div class="top-bar-right">
      <a href="https://www.converse.com/c/help" class="top-bar-link">Help</a>
      <a href="https://www.converse.com/signin" class="top-bar-link top-bar-signin">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Sign In
      </a>
    </div>
  </div>`;
  block.prepend(topBar);

  // auto-rotate promo messages
  let promoIndex = 0;
  const promoItems = topBar.querySelectorAll('.top-bar-promo');
  if (promoItems.length > 1) {
    setInterval(() => {
      promoItems[promoIndex].classList.remove('active');
      promoIndex = (promoIndex + 1) % promoItems.length;
      promoItems[promoIndex].classList.add('active');
    }, 5000);
  }

  // replace nav-tools text with SVG icons
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const toolLinks = navTools.querySelectorAll('a');
    const icons = {
      Search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      Favorites: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      Cart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    };
    toolLinks.forEach((link) => {
      const text = link.textContent.trim();
      if (icons[text]) {
        link.innerHTML = `${icons[text]}<span class="sr-only">${text}</span>`;
        link.setAttribute('aria-label', text);
      }
    });
  }
}
