import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { StatCounter } from './StatCounter';
import './StatCounter.css';

export default declareComponent(StatCounter, {
  name: 'Stat Counter',
  description: 'Count-up statistic: SSR-safe, reduced-motion aware, screen-reader friendly',
  group: 'Content',
  props: {
    value: props.Number({ name: 'Value', defaultValue: 2400, decimals: 2 }),
    decimals: props.Number({ name: 'Decimals', defaultValue: 0, min: 0, max: 2, decimals: 0 }),
    prefix: props.Text({ name: 'Prefix', defaultValue: '' }),
    suffix: props.Text({ name: 'Suffix', defaultValue: '+' }),
    label: props.Text({ name: 'Label', defaultValue: 'teams shipping faster' }),
    duration: props.Number({ name: 'Duration (ms)', defaultValue: 1600, min: 0, max: 5000, decimals: 0 }),
  },
});
