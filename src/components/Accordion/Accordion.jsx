import { useId, useState } from 'react';

/**
 * Accessible FAQ accordion (WAI-ARIA APG "Accordion" pattern):
 * native <button> headers with aria-expanded/aria-controls, labelled regions, optional single-open mode.
 */
export function Accordion({ items = [], allowMultiple = false, defaultOpen = -1, variant = 'bordered', headingLevel = 3 }) {
  const base = useId();
  const visible = items.filter((it) => it && String(it.question ?? '').trim());
  const [open, setOpen] = useState(() => new Set(defaultOpen >= 0 && defaultOpen < visible.length ? [defaultOpen] : []));
  const H = `h${Math.min(6, Math.max(2, headingLevel))}`;

  const toggle = (i) => setOpen((prev) => {
    const next = new Set(allowMultiple ? prev : prev.has(i) ? [i] : []);
    if (prev.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  if (!visible.length) return <div className="wcc-accordion wcc-empty">Add a question in the component settings.</div>;

  return (
    <div className={`wcc-accordion wcc-accordion--${variant}`}>
      {visible.map((it, i) => {
        const isOpen = open.has(i);
        const btnId = `${base}-btn-${i}`;
        const panelId = `${base}-panel-${i}`;
        return (
          <div className="wcc-accordion__item" key={btnId}>
            <H className="wcc-accordion__heading">
              <button type="button" id={btnId} className="wcc-accordion__trigger" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(i)}>
                <span>{it.question}</span>
                <span className="wcc-accordion__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </H>
            <div id={panelId} role="region" aria-labelledby={btnId} className="wcc-accordion__panel" hidden={!isOpen}>
              {it.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
