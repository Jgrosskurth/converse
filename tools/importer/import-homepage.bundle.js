var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const cells = [];
    const bgImage = element.querySelector('picture img.modular-tile__img, picture img[class*="modular-tile__img"]');
    if (bgImage) {
      const picture = bgImage.closest("picture");
      cells.push([picture || bgImage]);
    }
    const overlay = element.querySelector(".modular-tile--overlay");
    const contentCell = [];
    if (overlay) {
      const headingEl = overlay.querySelector('[class*="heading-type"], h1, h2, h3, h4');
      if (headingEl) {
        const h2 = document.createElement("h2");
        h2.textContent = headingEl.textContent.trim();
        contentCell.push(h2);
      }
      const descEl = overlay.querySelector('[class*="body-type--micro"], [class*="body-type--small"], p');
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        contentCell.push(p);
      }
      const ctaLinks = overlay.querySelectorAll('.modular-tile__list a, a.button, a[class*="button"]');
      ctaLinks.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim().replace(/\u00a0/g, "").trim() || "Shop";
        contentCell.push(a);
      });
    }
    if (contentCell.length === 0) {
      const allLinks = element.querySelectorAll('a[href*="/shop/"]');
      if (allLinks.length > 0) {
        const a = document.createElement("a");
        a.href = allLinks[0].href;
        a.textContent = "Shop";
        contentCell.push(a);
      }
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-categories.js
  function parse2(element, { document }) {
    const cells = [];
    const slideImages = element.querySelectorAll("picture");
    const slideTitles = element.querySelectorAll(".featured-carousel__slide-title__single");
    const slideLinks = element.querySelectorAll('a[href*="/shop/"]');
    const uniqueLinks = [];
    const seenHrefs = /* @__PURE__ */ new Set();
    slideLinks.forEach((link) => {
      const href = link.href;
      if (!seenHrefs.has(href)) {
        seenHrefs.add(href);
        uniqueLinks.push(link);
      }
    });
    const slideCount = Math.max(slideImages.length, slideTitles.length, uniqueLinks.length);
    for (let i = 0; i < slideCount; i++) {
      const imgCell = [];
      const contentCell = [];
      if (slideImages[i]) {
        const picture = slideImages[i];
        imgCell.push(picture);
      }
      if (slideTitles[i]) {
        const h2 = document.createElement("h2");
        h2.textContent = slideTitles[i].textContent.trim();
        contentCell.push(h2);
      }
      if (uniqueLinks[i]) {
        const a = document.createElement("a");
        a.href = uniqueLinks[i].href;
        a.textContent = uniqueLinks[i].textContent.trim() || "Shop";
        contentCell.push(a);
      }
      if (imgCell.length > 0 || contentCell.length > 0) {
        cells.push([imgCell.length > 0 ? imgCell : "", contentCell.length > 0 ? contentCell : ""]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-categories", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-editorial.js
  function parse3(element, { document }) {
    const cells = [];
    const bgImage = element.querySelector('picture img.modular-tile__img, picture img[class*="modular-tile__img"]');
    if (bgImage) {
      const picture = bgImage.closest("picture");
      cells.push([picture || bgImage]);
    }
    const overlay = element.querySelector(".modular-tile--overlay");
    const contentCell = [];
    if (overlay) {
      const headingEl = overlay.querySelector('[class*="heading-type"], h1, h2, h3, h4');
      if (headingEl) {
        const h2 = document.createElement("h2");
        h2.textContent = headingEl.textContent.trim();
        contentCell.push(h2);
      }
      const descEl = overlay.querySelector('[class*="body-type--micro"], [class*="body-type--small"], p');
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        contentCell.push(p);
      }
      const ctaLinks = overlay.querySelectorAll('.modular-tile__list a, a.button, a[class*="button"]');
      ctaLinks.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim().replace(/\u00a0/g, "").trim() || "Shop";
        contentCell.push(a);
      });
    }
    if (contentCell.length === 0) {
      const allLinks = element.querySelectorAll('a[href*="/shop/"]');
      if (allLinks.length > 0) {
        const a = document.createElement("a");
        a.href = allLinks[0].href;
        a.textContent = "Shop";
        contentCell.push(a);
      }
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-editorial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse4(element, { document }) {
    const cells = [];
    const columns = element.querySelectorAll(":scope > .row > .col-md-6, :scope > div > .col-md-6, .col-12.col-md-6");
    if (columns.length >= 2) {
      const row = [];
      columns.forEach((col) => {
        const cellContent = [];
        const picture = col.querySelector("picture");
        if (picture) {
          cellContent.push(picture);
        }
        const label = col.querySelector('[class*="body-type--centi"], [class*="body-type--micro"]');
        if (label) {
          const p = document.createElement("p");
          p.textContent = label.textContent.trim().replace(/\u00a0/g, " ").trim();
          if (p.textContent) cellContent.push(p);
        }
        const heading = col.querySelector('[class*="heading-type"], h1, h2, h3, h4');
        if (heading) {
          const h2 = document.createElement("h2");
          h2.textContent = heading.textContent.trim().replace(/\u00a0/g, " ").trim();
          if (h2.textContent) cellContent.push(h2);
        }
        const overlayEl = col.querySelector(".modular-tile--overlay");
        if (overlayEl) {
          const descEls = overlayEl.querySelectorAll('p, [class*="body-type--small"]');
          descEls.forEach((desc) => {
            const text = desc.textContent.trim().replace(/\u00a0/g, " ").trim();
            if (text && text.length > 3) {
              const p = document.createElement("p");
              p.textContent = text;
              cellContent.push(p);
            }
          });
        }
        const ctaLinks = col.querySelectorAll('a.button, a[class*="button"], .modular-tile__list a');
        const seenHrefs = /* @__PURE__ */ new Set();
        ctaLinks.forEach((link) => {
          const href = link.href;
          const text = link.textContent.trim().replace(/\u00a0/g, "").trim();
          if (text && !seenHrefs.has(href)) {
            seenHrefs.add(href);
            const a = document.createElement("a");
            a.href = href;
            a.textContent = text;
            cellContent.push(a);
          }
        });
        row.push(cellContent.length > 0 ? cellContent : "");
      });
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-marketing.js
  function parse5(element, { document }) {
    const cells = [];
    const columns = element.querySelectorAll(".marketing-tiles__col, .col-md-3");
    const row = [];
    columns.forEach((col) => {
      const cellContent = [];
      const icon = col.querySelector(".marketing-tiles__item-icon__wrapper, .marketing-tiles__item-icon, picture, img");
      if (icon) {
        const iconEl = col.querySelector("svg, img");
        if (iconEl && iconEl.tagName === "IMG") {
          cellContent.push(iconEl);
        }
      }
      const title = col.querySelector('.marketing-tiles__item-title, [class*="item-title"]');
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        cellContent.push(h3);
      }
      const desc = col.querySelector('.marketing-tiles__item-description, [class*="item-description"]');
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        cellContent.push(p);
      }
      const link = col.querySelector('.marketing-tiles__item-link, a[class*="link--underline"]');
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim().replace(/\u00a0/g, "").trim() || "Learn More";
        cellContent.push(a);
      }
      const socialLinks = col.querySelectorAll('a[href*="instagram"], a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], a[href*="tiktok"]');
      if (socialLinks.length > 0) {
        socialLinks.forEach((social) => {
          const a = document.createElement("a");
          a.href = social.href;
          a.textContent = social.textContent.trim() || social.getAttribute("aria-label") || "Follow";
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-marketing", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/converse-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cookie-policy-modal",
        '[id*="onetrust"]',
        '[class*="cookie"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "klarna-placement",
        "klarna-placement-top-strip-promotion-auto-size"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".display--small-only"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".slick-cloned"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".header-container",
        ".global-container.scope-header",
        ".header-content-wrapper"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".footer",
        ".footer-item--accordions"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".global-promo-banner"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".skip-to-main--container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[id*="cq_recomm_slot"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        "svg",
        "#browser-check",
        ".back-to-top",
        '[id*="batBeacon"]'
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-tracking-cms-module");
        el.removeAttribute("data-slick-index");
        el.removeAttribute("data-carousel-config");
        el.removeAttribute("data-motion-trigger-ready");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/converse-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          try {
            const safeSel = sel.replace(/#(\d[^.\s#[>+~]*)/g, '[id="$1"]');
            sectionEl = element.querySelector(safeSel);
          } catch (e) {
            const idMatch = sel.match(/^#(.+)$/);
            if (idMatch) {
              sectionEl = element.querySelector(`[id="${idMatch[1]}"]`);
            }
          }
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          if (sectionEl.previousElementSibling) {
            const hr = document.createElement("hr");
            sectionEl.before(hr);
          }
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "carousel-categories": parse2,
    "hero-editorial": parse3,
    "columns-featured": parse4,
    "columns-marketing": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.converse.com"
    ],
    description: "Converse homepage with hero banners, featured collections, and promotional content",
    blocks: [
      {
        name: "hero-banner",
        instances: ["[id='03-13-hmpg-throwback_desktop'] .modular-tile--media"],
        section: "section-1"
      },
      {
        name: "carousel-categories",
        instances: [".featured-carousel"],
        section: "section-2"
      },
      {
        name: "hero-editorial",
        instances: ["[id='03-19-hmpg-converse-color_desktop'] .modular-tile--media"],
        section: "section-3"
      },
      {
        name: "columns-featured",
        instances: ["[id='03-19-hmpg-2-up-cby-shai-sold-out_desktop']"],
        section: "section-4"
      },
      {
        name: "columns-marketing",
        instances: [".marketing-tiles"],
        section: "section-7"
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero - Chuck Taylor Throwback",
        selector: "[id='03-13-hmpg-throwback_desktop']",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Categories Carousel",
        selector: ".featured-carousel",
        style: null,
        blocks: ["carousel-categories"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Converse Color - Chuck 70",
        selector: "[id='03-19-hmpg-converse-color_desktop']",
        style: null,
        blocks: ["hero-editorial"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Two-Up - Custom By You + SHAI 001",
        selector: "[id='03-19-hmpg-2-up-cby-shai-sold-out_desktop']",
        style: null,
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Email Signup",
        selector: "[id='07-09-hmpg-email-sign-up_desktop']",
        style: "dark",
        blocks: [],
        defaultContent: [
          "[id='07-09-hmpg-email-sign-up_desktop'] h2",
          "[id='07-09-hmpg-email-sign-up_desktop'] p",
          "[id='07-09-hmpg-email-sign-up_desktop'] a"
        ]
      },
      {
        id: "section-6",
        name: "Explore Converse - Wayfinding",
        selector: "[id='12-23-wayfinding_desktop']",
        style: null,
        blocks: [],
        defaultContent: [
          "[id='12-23-wayfinding_desktop'] h2",
          "[id='12-23-wayfinding_desktop'] a"
        ]
      },
      {
        id: "section-7",
        name: "Marketing Tiles",
        selector: ".marketing-tiles",
        style: null,
        blocks: ["columns-marketing"],
        defaultContent: []
      }
    ]
  };
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        let elements;
        try {
          elements = document.querySelectorAll(selector);
        } catch (e) {
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      try {
        transform.call(null, "afterTransform", main, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
      } catch (e) {
        console.error("Cleanup transformer failed:", e);
      }
      function findBlockTable(container, blockName) {
        const tables = container.querySelectorAll("table");
        for (const table of tables) {
          const th = table.querySelector("tr:first-child th");
          if (th && th.textContent.trim().toLowerCase().replace(/\s+/g, "-") === blockName) {
            return table;
          }
        }
        return null;
      }
      function extractDefaultContent(doc, container, selectorPrefix) {
        const section = container.querySelector(selectorPrefix);
        if (!section) return null;
        const nodes = [];
        const imgs = section.querySelectorAll("img");
        imgs.forEach((img) => {
          if (img.src && !img.src.includes("pixel") && !img.src.includes("track") && !img.src.includes("beacon") && !img.src.startsWith("blob:")) {
            const p = doc.createElement("p");
            const newImg = doc.createElement("img");
            newImg.src = img.src;
            newImg.alt = img.alt || "";
            p.appendChild(newImg);
            nodes.push(p);
          }
        });
        const headings = section.querySelectorAll("h1, h2, h3, h4");
        headings.forEach((h) => {
          const text = h.textContent.trim();
          if (text) {
            const h2 = doc.createElement("h2");
            h2.textContent = text;
            nodes.push(h2);
          }
        });
        const bodyEls = section.querySelectorAll('[class*="body-type"]');
        const seenText = /* @__PURE__ */ new Set();
        bodyEls.forEach((el) => {
          const text = el.textContent.trim();
          if (text && text.length > 10 && !seenText.has(text)) {
            seenText.add(text);
            const p = doc.createElement("p");
            const link = el.querySelector("a[href]");
            if (link) {
              p.textContent = text.replace(link.textContent.trim(), "").trim() + " ";
              const a = doc.createElement("a");
              a.href = link.href;
              const u = doc.createElement("u");
              u.textContent = link.textContent.trim();
              a.appendChild(u);
              p.appendChild(a);
            } else {
              p.textContent = text;
            }
            nodes.push(p);
          }
        });
        const ctaLinks = section.querySelectorAll('a.button, a[class*="button"], .modular-tile__list a');
        if (ctaLinks.length > 0) {
          const ul = doc.createElement("ul");
          ctaLinks.forEach((link) => {
            const text = link.textContent.trim().replace(/\u00a0/g, "").trim();
            if (text) {
              const li = doc.createElement("li");
              const a = doc.createElement("a");
              a.href = link.href || "#";
              a.textContent = text;
              li.appendChild(a);
              ul.appendChild(li);
            }
          });
          if (ul.children.length > 0) nodes.push(ul);
        }
        const wayLinks = section.querySelectorAll('.wayfinding__link a, a[class*="wayfinding"]');
        wayLinks.forEach((link) => {
          const text = link.textContent.trim().replace(/\s+/g, " ");
          if (text) {
            const ul = doc.createElement("ul");
            const li = doc.createElement("li");
            const a = doc.createElement("a");
            a.href = link.href;
            a.textContent = text;
            li.appendChild(a);
            ul.appendChild(li);
            nodes.push(ul);
          }
        });
        return nodes.length > 0 ? nodes : null;
      }
      const sectionDefs = [
        { id: "section-1", blockName: "hero-banner", style: null },
        { id: "section-2", blockName: "carousel-categories", style: null },
        { id: "section-3", blockName: "hero-editorial", style: null },
        { id: "section-4", blockName: "columns-featured", style: null },
        { id: "section-5", blockName: null, style: "dark", defaultSelector: "[id*='email-sign-up']" },
        { id: "section-6", blockName: null, style: null, defaultSelector: "[id*='wayfinding']" },
        { id: "section-7", blockName: "columns-marketing", style: null }
      ];
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
          allContent.push(__spreadProps(__spreadValues({}, def), { nodes }));
        }
      });
      main.innerHTML = "";
      allContent.forEach((section, idx) => {
        if (idx > 0) {
          main.appendChild(document.createElement("hr"));
        }
        section.nodes.forEach((node) => main.appendChild(node));
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: [["style", section.style]]
          });
          main.appendChild(sectionMetadata);
        }
      });
      main.querySelectorAll("img").forEach((img) => {
        if (img.src && img.src.includes("localhost:8765")) {
          img.src = img.src.replace(/http:\/\/localhost:8765/g, "https://www.converse.com");
        }
      });
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      const originalUrl = "https://www.converse.com";
      WebImporter.rules.adjustImageUrls(main, originalUrl, originalUrl);
      const path = "/index";
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
