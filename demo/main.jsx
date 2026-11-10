import { createRoot } from 'react-dom/client';
import { Accordion } from '../src/components/Accordion/Accordion.jsx';
import { PricingTable } from '../src/components/PricingTable/PricingTable.jsx';
import { StatCounter } from '../src/components/StatCounter/StatCounter.jsx';
import '../src/components/Accordion/Accordion.css';
import '../src/components/PricingTable/PricingTable.css';
import '../src/components/StatCounter/StatCounter.css';

// Same props a designer would set in Webflow's Properties panel.
createRoot(document.getElementById('demo-stats')).render(
  <div className="demo-stats">
    <StatCounter value={2400} suffix="+" label="teams shipping faster" />
    <StatCounter value={38.5} decimals={1} suffix="%" label="average conversion lift" />
    <StatCounter value={99.95} decimals={2} suffix="%" label="uptime last 12 months" />
  </div>,
);

createRoot(document.getElementById('demo-pricing')).render(
  <PricingTable title="Plans for every team" annualDiscount={20} currency="USD" plans={[
    { name: 'Starter', monthly: 0, features: ['1 project', 'Community support'], ctaLabel: 'Start free', cta: { href: '#signup' } },
    { name: 'Team', monthly: 29, features: ['Unlimited projects', 'Roles & permissions', 'Priority support'], highlighted: true, ctaLabel: 'Start trial', cta: { href: '#signup' } },
    { name: 'Enterprise', monthly: 99, features: ['SSO & SCIM', 'Audit logs', 'Dedicated success manager'], ctaLabel: 'Talk to sales', cta: { href: '#contact' } },
  ]} />,
);

createRoot(document.getElementById('demo-faq')).render(
  <Accordion defaultOpen={0} items={[
    { question: 'What is included in the free plan?', answer: <p>One project, unlimited collaborators in view-only mode, and community support.</p> },
    { question: 'Can I cancel anytime?', answer: <p>Yes. Plans are month-to-month or yearly; cancel from billing settings and keep access until the period ends.</p> },
    { question: 'Do you offer discounts for nonprofits?', answer: <p>Registered nonprofits get 50% off any paid plan.</p> },
  ]} />,
);
