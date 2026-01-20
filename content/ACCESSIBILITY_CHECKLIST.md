# Accessibility Audit Checklist (WCAG 2.1 AA)

Manual accessibility audit checklist for DexRank. Linting catches code-level issues;
this checklist covers user experience aspects that require human verification.

**Scope for v1:** This checklist is the baseline for launch. Full automated testing
(axe-core, Lighthouse CI) can be added in future iterations.

## Perceivable

### Text Alternatives (1.1)
- [ ] All images have meaningful alt text (not just "image" or filename)
- [ ] Decorative images use alt="" or are CSS backgrounds
- [ ] Charts/graphs have text alternatives describing the data
- [ ] Icons that convey meaning have accessible names

### Time-based Media (1.2)
- [ ] N/A for v1 (no video/audio content)

### Adaptable (1.3)
- [ ] Content is structured with semantic HTML (headings, lists, tables)
- [ ] Heading hierarchy is logical (h1 > h2 > h3, no skips)
- [ ] Tables have proper headers (th elements with scope)
- [ ] Form inputs have associated labels
- [ ] Reading order makes sense when CSS is disabled

### Distinguishable (1.4)
- [ ] Color is not the only way to convey information
- [ ] Text contrast ratio is at least 4.5:1 (3:1 for large text)
- [ ] UI component contrast is at least 3:1
- [ ] Text can be resized to 200% without loss of content
- [ ] No horizontal scrolling at 320px viewport width
- [ ] Focus indicators are visible

## Operable

### Keyboard Accessible (2.1)
- [ ] All functionality is available via keyboard
- [ ] No keyboard traps (can Tab away from any element)
- [ ] Focus order is logical (follows visual order)
- [ ] Skip links or landmarks help bypass repeated content

### Enough Time (2.2)
- [ ] N/A for v1 (no time limits or auto-updating content)

### Seizures and Physical Reactions (2.3)
- [ ] No content flashes more than 3 times per second

### Navigable (2.4)
- [ ] Pages have descriptive titles
- [ ] Focus is visible on interactive elements
- [ ] Links have descriptive text (not just "click here")
- [ ] Multiple ways to navigate (nav, search, sitemap)
- [ ] Breadcrumbs present on nested pages

### Input Modalities (2.5)
- [ ] Touch targets are at least 44x44 CSS pixels
- [ ] Dragging is not required (alternatives exist)

## Understandable

### Readable (3.1)
- [ ] Page language is declared (html lang="en")
- [ ] Abbreviations are explained on first use

### Predictable (3.2)
- [ ] Navigation is consistent across pages
- [ ] Components behave consistently
- [ ] No unexpected context changes on focus/input

### Input Assistance (3.3)
- [ ] Error messages are clear and specific
- [ ] Required fields are marked
- [ ] Error prevention for important actions

## Robust

### Compatible (4.1)
- [ ] HTML validates without significant errors
- [ ] ARIA attributes are used correctly
- [ ] Custom components have appropriate roles

---

## Testing Tools

Quick manual tests:
1. **Keyboard-only:** Navigate entire site with Tab, Enter, Escape
2. **Screen reader:** Test key pages with VoiceOver (Mac) or NVDA (Windows)
3. **Zoom:** Set browser zoom to 200%, check for overflow
4. **Color:** View in grayscale mode, ensure all info is conveyed
5. **Mobile:** Test on real device, check touch targets

Automated tools (for future CI integration):
- Lighthouse accessibility audit
- axe DevTools browser extension
- WAVE browser extension

## DexRank-Specific Considerations

### Rankings Table
- [ ] Table has proper th/scope attributes
- [ ] Sortable columns announce state changes
- [ ] Pagination is keyboard accessible
- [ ] Filter changes announce results count

### Score Display
- [ ] Score breakdown uses more than color (patterns/text)
- [ ] Percentile bars have text alternatives
- [ ] Tooltips accessible via keyboard

### External Links
- [ ] External links indicate they open new window
- [ ] Affiliate disclosure is programmatically associated

## Related Documents
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Content standards
- eslint jsx-a11y rules - Code-level linting
