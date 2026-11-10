import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Accordion } from './Accordion';
import './Accordion.css';

const MAX_ITEMS = 6;

// Webflow props are flat (no arrays), so the designer gets N question/answer pairs; empty ones are skipped.
function WebflowAccordion(p) {
  const items = Array.from({ length: MAX_ITEMS }, (_, i) => ({ question: p[`q${i + 1}`], answer: p[`a${i + 1}`] }));
  return <Accordion items={items} allowMultiple={p.allowMultiple} variant={p.variant} headingLevel={Number(p.headingLevel)} defaultOpen={p.firstOpen ? 0 : -1} />;
}

const itemProps = {};
for (let i = 1; i <= MAX_ITEMS; i++) {
  itemProps[`q${i}`] = props.Text({ name: `Question ${i}`, group: `Item ${i}`, defaultValue: i <= 2 ? ['What is included in the free plan?', 'Can I cancel anytime?'][i - 1] : '' });
  itemProps[`a${i}`] = props.RichText({ name: `Answer ${i}`, group: `Item ${i}` });
}

export default declareComponent(WebflowAccordion, {
  name: 'FAQ Accordion',
  description: 'Accessible accordion (WAI-ARIA pattern) for FAQs',
  group: 'Content',
  props: {
    variant: props.Variant({ name: 'Style', options: ['bordered', 'minimal'], defaultValue: 'bordered' }),
    allowMultiple: props.Boolean({ name: 'Allow multiple open', defaultValue: false, trueLabel: 'Yes', falseLabel: 'No' }),
    firstOpen: props.Boolean({ name: 'First item open', defaultValue: true, trueLabel: 'Open', falseLabel: 'Closed' }),
    headingLevel: props.Variant({ name: 'Heading level', options: ['2', '3', '4'], defaultValue: '3' }),
    ...itemProps,
  },
});
