# 🎨 Frontend Quality

> SEO, accessibility, and performance checks for web applications

---

## SEO Essentials
- [ ] Semantic HTML structure (header, main, nav, footer)
- [ ] Meta tags (title, description, viewport)
- [ ] Open Graph tags for social sharing
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for all images
- [ ] Canonical URLs where needed

## Accessibility (a11y)
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels where needed
- [ ] Color contrast sufficient (4.5:1 minimum)
- [ ] Form labels properly associated
- [ ] Skip navigation links

## Performance
- [ ] Images optimized (WebP, lazy loading)
- [ ] Code splitting / lazy loading routes
- [ ] No render-blocking resources
- [ ] Font loading strategy (display: swap)
- [ ] Bundle size monitored

## Core Web Vitals
- [ ] LCP: Main content loads fast
- [ ] FID/INP: Interactive quickly
- [ ] CLS: No layout shifts

## Mobile First
- [ ] Responsive design works
- [ ] Touch targets adequate (48px minimum)
- [ ] No horizontal scroll

---

## Integration Points

| Agent | Behavior |
|-------|----------|
| `vibe-implementer` | Apply frontend patterns during implementation |
| `code-reviewer` | Check accessibility and SEO in review |
| `test-generator` | Include a11y tests where applicable |
