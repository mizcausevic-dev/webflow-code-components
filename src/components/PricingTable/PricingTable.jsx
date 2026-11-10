import { useId, useState } from 'react';
import { annualMonthlyEquivalent, yearlySavings, formatPrice } from './pricing.js';

/**
 * Pricing table with an accessible monthly/annual switch (role="switch", aria-checked) and live savings.
 * plans: [{ name, monthly, features: string[], cta: { href, target }, ctaLabel, highlighted }]
 */
export function PricingTable({ plans = [], annualDiscount = 20, currency = 'USD', defaultBilling = 'annual', title = 'Plans' }) {
  const [annual, setAnnual] = useState(defaultBilling === 'annual');
  const labelId = useId();
  const visible = plans.filter((p) => p && String(p.name ?? '').trim());
  return (
    <section className="wcc-pricing" aria-labelledby={labelId}>
      <div className="wcc-pricing__bar">
        <h2 id={labelId} className="wcc-pricing__title">{title}</h2>
        <div className="wcc-pricing__toggle">
          <span aria-hidden="true" className={annual ? '' : 'is-active'}>Monthly</span>
          <button type="button" role="switch" aria-checked={annual} aria-label="Bill annually" className="wcc-switch" onClick={() => setAnnual((a) => !a)}>
            <span className="wcc-switch__thumb" />
          </button>
          <span aria-hidden="true" className={annual ? 'is-active' : ''}>Annual <em>save {annualDiscount}%</em></span>
        </div>
      </div>
      <div className="wcc-pricing__grid">
        {visible.map((p) => {
          const price = annual ? annualMonthlyEquivalent(p.monthly, annualDiscount) : Number(p.monthly);
          return (
            <article key={p.name} className={`wcc-plan${p.highlighted ? ' wcc-plan--highlight' : ''}`}>
              {p.highlighted ? <p className="wcc-plan__badge">Most popular</p> : null}
              <h3 className="wcc-plan__name">{p.name}</h3>
              <p className="wcc-plan__price" aria-live="polite">
                <strong>{formatPrice(price, currency)}</strong><span>/mo</span>
              </p>
              <p className="wcc-plan__note">{annual && Number(p.monthly) > 0 ? `Billed yearly · save ${formatPrice(yearlySavings(p.monthly, annualDiscount), currency)}/yr` : Number(p.monthly) > 0 ? 'Billed monthly' : 'Free forever'}</p>
              <ul className="wcc-plan__features">{(p.features ?? []).filter(Boolean).map((f) => <li key={f}>{f}</li>)}</ul>
              {p.cta?.href ? <a className="wcc-plan__cta" href={p.cta.href} target={p.cta.target || undefined} rel={p.cta.target === '_blank' ? 'noopener noreferrer' : undefined}>{p.ctaLabel || 'Get started'}</a> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
