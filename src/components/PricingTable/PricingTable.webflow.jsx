import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { PricingTable } from './PricingTable';
import './PricingTable.css';

const split = (s) => String(s ?? '').split(/\r?\n|;/).map((x) => x.trim()).filter(Boolean);

function WebflowPricingTable(p) {
  const plans = [1, 2, 3].map((i) => ({
    name: p[`plan${i}Name`],
    monthly: p[`plan${i}Price`],
    features: split(p[`plan${i}Features`]),
    cta: p[`plan${i}Link`],
    ctaLabel: p[`plan${i}Cta`],
    highlighted: p.highlight === String(i),
  }));
  return <PricingTable title={p.title} plans={plans} annualDiscount={p.annualDiscount} currency={p.currency} defaultBilling={p.defaultBilling} />;
}

const plan = (i, name, price, features) => ({
  [`plan${i}Name`]: props.Text({ name: 'Name', group: `Plan ${i}`, defaultValue: name }),
  [`plan${i}Price`]: props.Number({ name: 'Monthly price', group: `Plan ${i}`, defaultValue: price, min: 0, decimals: 2 }),
  [`plan${i}Features`]: props.Text({ name: 'Features (one per line or ; separated)', group: `Plan ${i}`, defaultValue: features }),
  [`plan${i}Cta`]: props.Text({ name: 'Button label', group: `Plan ${i}`, defaultValue: 'Get started' }),
  [`plan${i}Link`]: props.Link({ name: 'Button link', group: `Plan ${i}` }),
});

export default declareComponent(WebflowPricingTable, {
  name: 'Pricing Table',
  description: 'Three-plan pricing table with an accessible monthly/annual switch',
  group: 'Commerce',
  props: {
    title: props.Text({ name: 'Heading', defaultValue: 'Plans for every team' }),
    currency: props.Variant({ name: 'Currency', options: ['USD', 'EUR', 'GBP'], defaultValue: 'USD' }),
    annualDiscount: props.Number({ name: 'Annual discount %', defaultValue: 20, min: 0, max: 90, decimals: 0 }),
    defaultBilling: props.Variant({ name: 'Default billing', options: ['annual', 'monthly'], defaultValue: 'annual' }),
    highlight: props.Variant({ name: 'Highlighted plan', options: ['1', '2', '3'], defaultValue: '2' }),
    ...plan(1, 'Starter', 0, '1 project; Community support'),
    ...plan(2, 'Team', 29, 'Unlimited projects; Roles & permissions; Priority support'),
    ...plan(3, 'Enterprise', 99, 'SSO & SCIM; Audit logs; Dedicated success manager'),
  },
});
