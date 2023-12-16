import {LitElement, unsafeCSS, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import compentStyle from './breadcrumb.css?inline';
import '../icon/icon';

export interface BreadcrumbItem {
  label: string;
}

@customElement('obc-breadcrumb')
export class Breadcrumb extends LitElement {
  @property({attribute: false}) items = [] as BreadcrumbItem[];

  render() {
    return html`
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <ol>
          ${this.items.map(
            (item, i) => html`
              <li>
                ${i > 0
                  ? html`<span class="icon"
                      ><obc-icon
                        icon="02-chevron-right"
                        class="divider"
                      ></obc-icon
                    ></span>`
                  : ''}
                <span class="label">${item.label}</span>
              </li>
            `
          )}
        </ol>
      </nav>
    `;
  }

  static styles = unsafeCSS(compentStyle);
}

declare global {
  interface HTMLElementTagNameMap {
    'obc-breadcrumb': Breadcrumb;
  }
}