/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Converse sections.
 * Adds section breaks (<hr>) and section-metadata blocks from template sections.
 * Runs in afterTransform only. Uses payload.template.sections.
 * Selectors from captured DOM of https://www.converse.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

    // Process sections in reverse order to avoid position shifts
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Find the first element matching the section selector
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectorList) {
        try {
          // Escape ID selectors that start with digits (e.g. #03-13-... -> [id="03-13-..."])
          const safeSel = sel.replace(/#(\d[^.\s#[>+~]*)/g, '[id="$1"]');
          sectionEl = element.querySelector(safeSel);
        } catch (e) {
          // Fallback: try as attribute selector if ID starts with digit
          const idMatch = sel.match(/^#(.+)$/);
          if (idMatch) {
            sectionEl = element.querySelector(`[id="${idMatch[1]}"]`);
          }
        }
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before section (except the first section)
      if (section.id !== template.sections[0].id) {
        // Only add <hr> if there is content before this section
        if (sectionEl.previousElementSibling) {
          const hr = document.createElement('hr');
          sectionEl.before(hr);
        }
      }
    });
  }
}
