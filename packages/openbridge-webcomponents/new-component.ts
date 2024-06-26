import fs from 'fs';
import path from 'path';

import {question, select, multiselect} from '@topcli/prompts';

const name = await question(
  'Component name (without obc prefix, and UpperCamelCase) ?',
  {
    validators: [
      {
        validate: (value) => /^[A-Z][a-zA-Z0-9]+$/.test(value),
        message: 'Component name must be UpperCamelCase',
      },
      {
        message: 'Component name is required',
        validate: (value) => !!value,
      },
    ],
  }
);
const componentType = await select('Type of component', {
  choices: [
    'ui(input, label, tables)',
    'instrument (compas, azimuth)',
    'automation',
  ],
});
const files = await multiselect('Create files', {
  choices: ['lit', 'css', 'storybook'],
  preSelectedChoices: ['lit', 'css', 'storybook'],
});

// Convert name to kebab-case
const componentName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

let parentDir: string;
if (componentType.includes('ui')) {
  parentDir = 'components';
} else if (componentType.includes('instrument')) {
  parentDir = 'navigation-instruments';
} else {
  parentDir = 'automation';
}
const dir = path.join('src', parentDir, componentName);
// Create directory
fs.mkdirSync(dir);

// Create files
if (files.includes('lit')) {
  const hasCss = files.includes('css');
  const litFile = path.join(dir, `${componentName}.ts`);
  const content = `import { LitElement, html${
    hasCss ? `, unsafeCSS ` : ` `
  }} from 'lit'
import { customElement } from 'lit/decorators.js'
${hasCss ? `import compentStyle from "./${componentName}.css?inline";` : ''}

@customElement('obc-${componentName}')
export class Obc${name} extends LitElement {

  override render() {
    return html\`
      <div class="wrapper">
      </div>
      \`
  }

${hasCss ? `static override styles = unsafeCSS(compentStyle);` : ''}
}

declare global {
  interface HTMLElementTagNameMap {
    'obc-${componentName}': Obc${name}
  }
}
`;
  fs.writeFileSync(litFile, content);
}

if (files.includes('css')) {
  const cssFile = path.join(dir, `${componentName}.css`);
  const content = ``;
  fs.writeFileSync(cssFile, content);
}

if (files.includes('storybook')) {
  const storybookGroup = await question('Storybook group ');
  const storybookTitle = await question('Storybook title ');
  const storybookFile = path.join(dir, `${componentName}.stories.ts`);
  const content = `import type { Meta, StoryObj } from '@storybook/web-components';
import { Obc${name} } from './${componentName}';
import './${componentName}';

const meta: Meta<typeof Obc${name}> = {
  title: '${storybookGroup}/${storybookTitle}',
  tags: ['autodocs'],
  component: "obc-${componentName}",
  args: {
  },
} satisfies Meta<Obc${name}>;

export default meta;
type Story = StoryObj<Obc${name}>;

export const Primary: Story = {
  args: {
  },
}`;
  fs.writeFileSync(storybookFile, content);
}
