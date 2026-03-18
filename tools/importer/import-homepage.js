/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/academy-cleanup.js';
import sectionsTransformer from './transformers/academy-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'cards': cardsParser,
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Academy Sports + Outdoors homepage with featured categories, promotions, and brand content',
  urls: ['https://www.academy.com/'],
  blocks: [
    {
      name: 'hero',
      instances: [
        'section[data-pos="2"] .slider-wrapper',
        'section[data-pos="9"] #lets-play-ball .position-relative',
      ],
    },
    {
      name: 'cards',
      instances: [
        '.mt-section-item#mtFirstSection .grid-holder',
        '.mt-section-item#mtSecondSection .grid-holder',
        '.mt-section-item#mtThirdSection .grid-holder',
        '.mt-section-item#mtFourthSection .grid-holder',
        'section[data-pos="4"] #scrollable-container-run-month',
        'section[data-pos="6"] .scrollable-container',
        'section[data-pos="12"] #scrollable-container-work',
        'section[data-pos="16"] .info-component-container',
      ],
    },
    {
      name: 'columns',
      instances: [
        'section[data-pos="11"] #workwear .flex-container',
        'section[data-pos="13"] #fan-shop .flex-container',
        'section[data-pos="14"]',
        'section[data-pos="15"] #myacademy-rewards-3card',
      ],
    },
  ],
  sections: [
    {
      id: 'section-promo-banner',
      name: 'Promotional Banner',
      selector: '#buymore-banner',
      style: 'dark',
      blocks: [],
      defaultContent: ['#buymore-banner a'],
    },
    {
      id: 'section-hero-carousel',
      name: 'Hero Carousel',
      selector: 'section[data-pos="2"]',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-product-carousels',
      name: 'Product Carousels',
      selector: 'section[data-pos="3"]',
      style: null,
      blocks: ['cards'],
      defaultContent: [],
    },
    {
      id: 'section-running-shoes',
      name: 'Running Shoes Brand Showcase',
      selector: 'section[data-pos="4"]',
      style: 'light-gray',
      blocks: ['cards'],
      defaultContent: [],
    },
    {
      id: 'section-new-finds',
      name: 'New Finds / Color Drops',
      selector: 'section[data-pos="6"]',
      style: null,
      blocks: ['cards'],
      defaultContent: [],
    },
    {
      id: 'section-soccer',
      name: 'Soccer Promo',
      selector: 'section[data-pos="7"]',
      style: 'dark',
      blocks: [],
      defaultContent: ['section[data-pos="7"] a'],
    },
    {
      id: 'section-clearance',
      name: 'Clearance Banner',
      selector: '#clearance-banner',
      style: 'yellow',
      blocks: [],
      defaultContent: ['#clearance-banner a'],
    },
    {
      id: 'section-baseball',
      name: 'Baseball Promo',
      selector: 'section[data-pos="9"]',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-workwear-banner',
      name: 'Workwear Banner',
      selector: '#workwear-banner',
      style: 'yellow',
      blocks: [],
      defaultContent: ['#workwear-banner a'],
    },
    {
      id: 'section-workwear-deals',
      name: 'Workwear Deals',
      selector: 'section[data-pos="11"]',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-workwear-brands',
      name: 'Workwear Brands',
      selector: 'section[data-pos="12"]',
      style: null,
      blocks: ['cards'],
      defaultContent: ['section[data-pos="12"] h3'],
    },
    {
      id: 'section-fan-shop',
      name: 'Trending for Fans',
      selector: 'section[data-pos="13"]',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-rewards',
      name: 'More Savings / Rewards',
      selector: 'section[data-pos="14"]',
      style: 'academy-red',
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-app-card-text',
      name: 'App / Credit Card / Text Signup',
      selector: 'section[data-pos="15"]',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-service-features',
      name: 'Service Features',
      selector: 'section[data-pos="16"]',
      style: 'light-gray',
      blocks: ['cards'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
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
      console.error('Transformer failed at ' + hookName + ':', e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn('Invalid selector for "' + blockDef.name + '": ' + selector);
        return;
      }
      if (elements.length === 0) {
        console.warn('Block "' + blockDef.name + '" selector not found: ' + selector);
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

  console.log('Found ' + pageBlocks.length + ' block instances on page');
  return pageBlocks;
}

export default {
  /**
   * Preprocess: runs BEFORE the helix importer strips scripts.
   */
  preprocess: ({ document }) => {
    // No JSON scripts to preserve for Academy.com (React-rendered page)
  },

  transform: (payload) => {
    const { document, url, params } = payload;
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
          console.error('Failed to parse ' + block.name + ' (' + block.selector + '):', e);
        }
      } else {
        console.warn('No parser found for block: ' + block.name);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    let path = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '')
      .toLowerCase();
    if (!path || path === '') path = '/index';

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
