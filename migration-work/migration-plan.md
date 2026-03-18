# Migration Plan: Academy.com Homepage

**Mode:** Single Page
**Source:** https://www.academy.com/
**Generated:** 2026-03-18

## Migration Steps

- [x] 0. Initialize Migration Plan
- [x] 1. Project Setup (DA project, sta-boilerplate library)
- [x] 2. Site Analysis (1 template: homepage)
- [x] 3. Page Analysis (14 sections, 3 block types: hero, cards, columns)
- [x] 4. Block Mapping (hero:2, cards:8, columns:4 instances + 14 sections with styles)
- [x] 5. Import Infrastructure (3 parsers, 2 transformers, 1 import script)
- [x] 6. Content Import (1 page imported: index.plain.html)

## Current Status
- **Active Step:** Complete
- **Last Updated:** 2026-03-18

## Content Import Summary
- homepage: 1 page imported
- **Total: 1 page imported**

## Generated Artifacts
- .migration/project.json
- migration-work/migration-plan.md
- migration-work/metadata.json
- migration-work/screenshot.png
- migration-work/cleaned.html
- migration-work/page-structure.json
- migration-work/authoring-analysis.json
- tools/importer/page-templates.json (with blocks + sections)
- tools/importer/parsers/hero.js
- tools/importer/parsers/cards.js
- tools/importer/parsers/columns.js
- tools/importer/transformers/academy-cleanup.js
- tools/importer/transformers/academy-sections.js
- tools/importer/import-homepage.js
- tools/importer/urls-homepage.txt
- content/index.plain.html

## Known Issues
- Duplicate section-metadata blocks in some sections (md2da creates both table and rowgroup formats)
- Chatbot (Scout AI) and bot verification dialog content leaked into final section
- Some empty sections need cleanup
- Old Bridgestone content files still in content/ directory (index.html, nav.html, footer.html)

## Recommended Next Steps
1. Improve academy-cleanup.js transformer to remove chatbot/dialog elements
2. Fix duplicate section-metadata output (may be md2da issue)
3. Clean up old Bridgestone files from content/ directory
4. Preview and verify block rendering
5. Improve parsers for better content extraction
