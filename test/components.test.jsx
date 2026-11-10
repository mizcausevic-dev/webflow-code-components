import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { Accordion } from '../src/components/Accordion/Accordion.jsx';
import { PricingTable } from '../src/components/PricingTable/PricingTable.jsx';
import { annualMonthlyEquivalent, yearlySavings, formatPrice } from '../src/components/PricingTable/pricing.js';
import { StatCounter, valueAt, easeOutCubic } from '../src/components/StatCounter/StatCounter.jsx';
import AccordionDecl from '../src/components/Accordion/Accordion.webflow.jsx';
import PricingDecl from '../src/components/PricingTable/PricingTable.webflow.jsx';
import StatDecl from '../src/components/StatCounter/StatCounter.webflow.jsx';

test('Accordion SSR: APG semantics, first item open, empty items skipped', () => {
  const html = renderToString(<Accordion defaultOpen={0} items={[{ question: 'Q1', answer: 'A1' }, { question: '', answer: 'x' }, { question: 'Q2', answer: 'A2' }]} />);
  assert.equal((html.match(/<button/g) ?? []).length, 2);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /role="region"/);
  const controls = [...html.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1]);
  for (const id of controls) assert.ok(html.includes(`id="${id}"`), `panel ${id} must exist`);
  assert.equal((html.match(/hidden=""/g) ?? []).length, 1, 'only the closed panel is hidden');
  assert.match(html, /<h3 class="wcc-accordion__heading">/);
});

test('Accordion clamps heading level and renders an editor hint when empty', () => {
  assert.match(renderToString(<Accordion headingLevel={9} items={[{ question: 'Q', answer: 'A' }]} />), /<h6/);
  assert.match(renderToString(<Accordion items={[]} />), /Add a question/);
});

test('pricing math', () => {
  assert.equal(annualMonthlyEquivalent(29, 20), 23.2);
  assert.equal(yearlySavings(29, 20), 69.6);
  assert.equal(annualMonthlyEquivalent(10, 500), 1, 'discount clamps to 90%');
  assert.equal(formatPrice(23.2, 'USD'), '$23.20');
  assert.equal(formatPrice(29, 'EUR'), '€29');
  assert.equal(formatPrice('x'), '—');
});

test('PricingTable SSR: switch semantics, annual prices by default, safe external links', () => {
  const html = renderToString(<PricingTable annualDiscount={20} plans={[
    { name: 'Starter', monthly: 0, features: ['1 project'] },
    { name: 'Team', monthly: 29, features: ['Unlimited'], highlighted: true, cta: { href: 'https://example.com/buy', target: '_blank' } },
    { name: '', monthly: 5 },
  ]} />);
  assert.match(html, /role="switch"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /\$23\.20/);
  assert.match(html, /save \$69\.60\/yr/);
  assert.match(html, /Free forever/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.equal((html.match(/<article/g) ?? []).length, 2);
  assert.match(renderToString(<PricingTable defaultBilling="monthly" plans={[{ name: 'Team', monthly: 29 }]} />), /\$29<\/strong>/);
});

test('StatCounter SSR renders the final value (no CLS, crawler-friendly) with an accessible copy', () => {
  const html = renderToString(<StatCounter value={2400} suffix="+" label="teams" />);
  assert.match(html, /aria-hidden="true">2,400\+</);
  assert.match(html, /class="wcc-sr">2,400\+</);
  assert.match(html, /<figcaption/);
});

test('count-up easing', () => {
  assert.equal(valueAt(100, 0, 1000), 0);
  assert.equal(valueAt(100, 1000, 1000), 100);
  assert.equal(valueAt(100, 5000, 1000), 100);
  assert.equal(valueAt(100, 0, 0), 100);
  assert.ok(easeOutCubic(0.5) > 0.5);
});

test('Webflow declarations load and are default-exported', () => {
  for (const d of [AccordionDecl, PricingDecl, StatDecl]) assert.ok(d, 'declareComponent must return a definition');
});
