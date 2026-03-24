/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import carouselCategoriesParser from './parsers/carousel-categories.js';
import heroEditorialParser from './parsers/hero-editorial.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import columnsMarketingParser from './parsers/columns-marketing.js';

// TRANSFORMER IMPORTS
import converseCleanupTransformer from './transformers/converse-cleanup.js';
import converseSectionsTransformer from './transformers/converse-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'carousel-categories': carouselCategoriesParser,
  'hero-editorial': heroEditorialParser,
  'columns-featured': columnsFeaturedParser,
  'columns-marketing': columnsMarketingParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  converseCleanupTransformer,
  converseSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.converse.com',
  ],
  description: 'Converse homepage with hero banners, featured collections, and promotional content',
  blocks: [
    {
      name: 'hero-banner',
      instances: ["[id='03-13-hmpg-throwback_desktop'] .modular-tile--media"],
      section: 'section-1',
    },
    {
      name: 'carousel-categories',
      instances: ['.featured-carousel'],
      section: 'section-2',
    },
    {
      name: 'hero-editorial',
      instances: ["[id='03-19-hmpg-converse-color_desktop'] .modular-tile--media"],
      section: 'section-3',
    },
    {
      name: 'columns-featured',
      instances: ["[id='03-19-hmpg-2-up-cby-shai-sold-out_desktop']"],
      section: 'section-4',
    },
    {
      name: 'columns-marketing',
      instances: ['.marketing-tiles'],
      section: 'section-7',
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero - Chuck Taylor Throwback',
      selector: "[id='03-13-hmpg-throwback_desktop']",
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Categories Carousel',
      selector: '.featured-carousel',
      style: null,
      blocks: ['carousel-categories'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Converse Color - Chuck 70',
      selector: "[id='03-19-hmpg-converse-color_desktop']",
      style: null,
      blocks: ['hero-editorial'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Two-Up - Custom By You + SHAI 001',
      selector: "[id='03-19-hmpg-2-up-cby-shai-sold-out_desktop']",
      style: null,
      blocks: ['columns-featured'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Email Signup',
      selector: "[id='07-09-hmpg-email-sign-up_desktop']",
      style: 'dark',
      blocks: [],
      defaultContent: [
        "[id='07-09-hmpg-email-sign-up_desktop'] h2",
        "[id='07-09-hmpg-email-sign-up_desktop'] p",
        "[id='07-09-hmpg-email-sign-up_desktop'] a",
      ],
    },
    {
      id: 'section-6',
      name: 'Explore Converse - Wayfinding',
      selector: "[id='12-23-wayfinding_desktop']",
      style: null,
      blocks: [],
      defaultContent: [
        "[id='12-23-wayfinding_desktop'] h2",
        "[id='12-23-wayfinding_desktop'] a",
      ],
    },
    {
      id: 'section-7',
      name: 'Marketing Tiles',
      selector: '.marketing-tiles',
      style: null,
      blocks: ['columns-marketing'],
      defaultContent: [],
    },
  ],
};

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        // Handle selectors with digit-starting IDs
        const safeSelector = selector.replace(/#(\d[^.\s#[>+~]*)/g, '[id="$1"]');
        try {
          elements = document.querySelectorAll(safeSelector);
        } catch (e2) {
          console.warn(`Block "${blockDef.name}" selector invalid: ${selector}`);
          return;
        }
      }
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup only, skip sections transformer)
    // Run cleanup transformer only - we handle sections manually below
    try {
      converseCleanupTransformer.call(null, 'afterTransform', main, { ...payload, template: PAGE_TEMPLATE });
    } catch (e) {
      console.error('Cleanup transformer failed:', e);
    }

    // 4.5 Flatten content and add section breaks
    // After parsers run, block tables are <table> elements (from WebImporter.Blocks.createBlock).
    // We need to find them, extract default content, and rebuild main with <hr> section breaks.

    // Helper: find a block table by its header name (case-insensitive)
    function findBlockTable(container, blockName) {
      const tables = container.querySelectorAll('table');
      for (const table of tables) {
        const th = table.querySelector('tr:first-child th');
        if (th && th.textContent.trim().toLowerCase().replace(/\s+/g, '-') === blockName) {
          return table;
        }
      }
      return null;
    }

    // Helper: extract default content from a section container
    function extractDefaultContent(doc, container, selectorPrefix) {
      const section = container.querySelector(selectorPrefix);
      if (!section) return null;
      const nodes = [];

      // Get images
      const imgs = section.querySelectorAll('img');
      imgs.forEach((img) => {
        if (img.src && !img.src.includes('pixel') && !img.src.includes('track') && !img.src.includes('beacon') && !img.src.startsWith('blob:')) {
          const p = doc.createElement('p');
          const newImg = doc.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt || '';
          p.appendChild(newImg);
          nodes.push(p);
        }
      });

      // Get headings
      const headings = section.querySelectorAll('h1, h2, h3, h4');
      headings.forEach((h) => {
        const text = h.textContent.trim();
        if (text) {
          const h2 = doc.createElement('h2');
          h2.textContent = text;
          nodes.push(h2);
        }
      });

      // Get body text
      const bodyEls = section.querySelectorAll('[class*="body-type"]');
      const seenText = new Set();
      bodyEls.forEach((el) => {
        const text = el.textContent.trim();
        if (text && text.length > 10 && !seenText.has(text)) {
          seenText.add(text);
          const p = doc.createElement('p');
          // Check for links inside
          const link = el.querySelector('a[href]');
          if (link) {
            p.textContent = text.replace(link.textContent.trim(), '').trim() + ' ';
            const a = doc.createElement('a');
            a.href = link.href;
            const u = doc.createElement('u');
            u.textContent = link.textContent.trim();
            a.appendChild(u);
            p.appendChild(a);
          } else {
            p.textContent = text;
          }
          nodes.push(p);
        }
      });

      // Get CTA links (buttons)
      const ctaLinks = section.querySelectorAll('a.button, a[class*="button"], .modular-tile__list a');
      if (ctaLinks.length > 0) {
        const ul = doc.createElement('ul');
        ctaLinks.forEach((link) => {
          const text = link.textContent.trim().replace(/\u00a0/g, '').trim();
          if (text) {
            const li = doc.createElement('li');
            const a = doc.createElement('a');
            a.href = link.href || '#';
            a.textContent = text;
            li.appendChild(a);
            ul.appendChild(li);
          }
        });
        if (ul.children.length > 0) nodes.push(ul);
      }

      // Get wayfinding links
      const wayLinks = section.querySelectorAll('.wayfinding__link a, a[class*="wayfinding"]');
      wayLinks.forEach((link) => {
        const text = link.textContent.trim().replace(/\s+/g, ' ');
        if (text) {
          const ul = doc.createElement('ul');
          const li = doc.createElement('li');
          const a = doc.createElement('a');
          a.href = link.href;
          a.textContent = text;
          li.appendChild(a);
          ul.appendChild(li);
          nodes.push(ul);
        }
      });

      return nodes.length > 0 ? nodes : null;
    }

    // Define sections in order
    const sectionDefs = [
      { id: 'section-1', blockName: 'hero-banner', style: null },
      { id: 'section-2', blockName: 'carousel-categories', style: null },
      { id: 'section-3', blockName: 'hero-editorial', style: null },
      { id: 'section-4', blockName: 'columns-featured', style: null },
      { id: 'section-5', blockName: null, style: 'dark', defaultSelector: "[id*='email-sign-up']" },
      { id: 'section-6', blockName: null, style: null, defaultSelector: "[id*='wayfinding']" },
      { id: 'section-7', blockName: 'columns-marketing', style: null },
    ];

    // Collect section content
    const allContent = [];
    sectionDefs.forEach((def) => {
      const nodes = [];
      if (def.blockName) {
        const blockTable = findBlockTable(main, def.blockName);
        if (blockTable) {
          nodes.push(blockTable.cloneNode(true));
        }
      }
      if (def.defaultSelector) {
        const defaultNodes = extractDefaultContent(document, main, def.defaultSelector);
        if (defaultNodes) nodes.push(...defaultNodes);
      }
      if (nodes.length > 0) {
        allContent.push({ ...def, nodes });
      }
    });

    // Clear main and rebuild with section breaks
    main.innerHTML = '';
    allContent.forEach((section, idx) => {
      if (idx > 0) {
        main.appendChild(document.createElement('hr'));
      }
      section.nodes.forEach((node) => main.appendChild(node));
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: [['style', section.style]],
        });
        main.appendChild(sectionMetadata);
      }
    });

    // 4.6 Fix localhost image URLs → converse.com
    main.querySelectorAll('img').forEach((img) => {
      if (img.src && img.src.includes('localhost:8765')) {
        img.src = img.src.replace(/http:\/\/localhost:8765/g, 'https://www.converse.com');
      }
    });

    // 5. Apply WebImporter built-in rules
    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    // Use original converse.com URL for image URL adjustment
    const originalUrl = 'https://www.converse.com';
    WebImporter.rules.adjustImageUrls(main, originalUrl, originalUrl);

    // 6. Generate sanitized path (hardcoded for homepage)
    const path = '/index';

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
