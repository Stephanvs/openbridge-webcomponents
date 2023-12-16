import {LitElement, html, unsafeCSS} from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import iconStyle from './card-list-button.css?inline';
import '../icon/icon';
import {classMap} from 'lit/directives/class-map.js';

@customElement('obc-card-list-button')
export class CardListButton extends LitElement {
  @property({type: String}) icon = '01-placeholder';
  @property({type: String}) variant = 'normal';

  @queryAssignedElements({slot: 'leading-icon'})
  leadingIcon!: NodeListOf<HTMLElement>;
  @queryAssignedElements({slot: 'trailing-icon'})
  trailingIcon!: NodeListOf<HTMLElement>;
  @state() hasIconLeading = false;
  @state() hasIconTrailing = false;

  firstUpdated() {
    this.hasIconLeading = this.leadingIcon.length > 0;
    this.hasIconTrailing = this.trailingIcon.length > 0;
  }

  render() {
    return html`
      <button
        class=${classMap({
          wrapper: true,
          hasIconLeading: this.hasIconLeading,
          hasIconTrailing: this.hasIconTrailing,
        })}
      >
        <span class="icon leading"><slot name="leading-icon"></slot></span>
        <span class="label"><slot></slot></span>
        <span class="icon trailing"><slot name="trailing-icon"></slot></span>
      </button>
    `;
  }

  static styles = unsafeCSS(iconStyle);
}

declare global {
  interface HTMLElementTagNameMap {
    'obc-card-list-button': CardListButton;
  }
}