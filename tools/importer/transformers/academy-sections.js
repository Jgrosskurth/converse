/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Academy.com sections.
 * Adds section breaks (<hr>) between content sections.
 * Uses payload.template.sections from page-templates.json.
 * Adds section-metadata blocks for sections with styles.
 * Selectors from captured DOM of https://www.academy.com/
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    // Process sections in reverse order to avoid shifting indices
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of selectors) {
        try {
          sectionEl = element.querySelector(sel);
        } catch (e) {
          // Skip invalid selectors
        }
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
