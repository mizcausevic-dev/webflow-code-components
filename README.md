# Webflow Code Components

[![CI](https://github.com/mizcausevic-dev/webflow-code-components/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/webflow-code-components/actions/workflows/ci.yml)
[![Pages](https://github.com/mizcausevic-dev/webflow-code-components/actions/workflows/pages.yml/badge.svg)](https://mizcausevic-dev.github.io/webflow-code-components/)
![React 19](https://img.shields.io/badge/react-19-5b8cff)
![License: MIT](https://img.shields.io/badge/license-MIT-8aa8ff)

**Live demo: https://mizcausevic-dev.github.io/webflow-code-components/**

A library of **Webflow code components**: React components declared with `declareComponent` (`@webflow/react`) and typed with `@webflow/data-types` props. Designers drop them onto the canvas and configure them in the Properties panel like native elements. CI bundles the library with **Webflow's own CLI** (`webflow devlink bundle`).

## Components

| Component | Designer props | Engineering details |
|---|---|---|
| **FAQ Accordion** | Style (Variant), allow multiple / first open (Boolean), heading level, 6 × Question (Text) + Answer (RichText) | WAI-ARIA APG accordion: native `<button>`, `aria-expanded`/`aria-controls`, labelled `role="region"`, configurable heading level, empty items skipped |
| **Pricing Table** | Heading, currency, annual discount %, default billing, highlighted plan, 3 × name / price (Number) / features / button label / Link | `role="switch"` billing toggle, live savings math, `Intl.NumberFormat` currency, `rel="noopener noreferrer"` on new-tab links |
| **Stat Counter** | Value, decimals, prefix, suffix, label, duration | SSR renders the final number (no layout shift, crawler-correct), counts up on scroll with `IntersectionObserver`, honors `prefers-reduced-motion`, screen readers get the final value only |

## How Webflow sees it

```jsx
// src/components/StatCounter/StatCounter.webflow.jsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { StatCounter } from './StatCounter';
import './StatCounter.css';

export default declareComponent(StatCounter, {
  name: 'Stat Counter',
  group: 'Content',
  props: {
    value: props.Number({ name: 'Value', defaultValue: 2400, decimals: 2 }),
    suffix: props.Text({ name: 'Suffix', defaultValue: '+' }),
    …
  },
});
```

Webflow props are flat with no arrays, so list-like components (FAQ items, plans) expose numbered prop groups. A thin `*.webflow.jsx` wrapper maps them to the clean array API of the underlying React component, which stays reusable outside Webflow.

## Workflow

```bash
npm ci
npm test                         # esbuild → node:test, SSR + logic tests
npx webflow devlink bundle       # local bundle with Webflow's CLI (also in CI)
npx webflow devlink import       # share the library to your Workspace (Workspace API token)
npm run build:demo               # the GitHub Pages demo
```

`webflow.json`:

```json
{ "library": { "name": "Kinetic Gain Components", "id": "kinetic-gain-components",
               "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"] } }
```

## Verification status

- **Tested:** 7 test suites using server-side rendering. They check APG attributes, that every `aria-controls` target exists, hidden-panel logic, heading-level clamping, pricing math and currency formatting, switch semantics, link `rel`, the SSR final value of the stat counter, the easing curve, and that every declaration module loads. CI also bundles the library with Webflow's CLI (`webflow devlink bundle` reported "Code Library bundled successfully", 773.5 KB) and fails on any production-dependency advisory. A headless-browser smoke test of the demo covers the billing toggle and single-open accordion behavior.
- **Not yet tested:** importing into a live Workspace (`devlink import` needs a Workspace API token) and rendering inside the Designer canvas. Build-time dev dependencies from the Webflow CLI currently carry npm audit advisories (see [SECURITY.md](SECURITY.md)). Runtime dependencies are clean.

## License

MIT © 2026 Mirza Causevic / Kinetic Gain LLC. Independent project, not affiliated with Webflow, Inc.
