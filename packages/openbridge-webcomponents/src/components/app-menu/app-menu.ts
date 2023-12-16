import {LitElement, unsafeCSS, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import compentStyle from './app-menu.css?inline';
import '../input/input';
import '../app-button/app-button';

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
}

@customElement('obc-app-menu')
export class AppMenu extends LitElement {
  @property({attribute: false}) items: Array<MenuItem> = [];
  @property({type: String}) selectedItemId: string = '';
  @state() private _search = '';

  onSearchInput(e: Event) {
    this._search = (e.target as HTMLInputElement).value;
  }

  onAppButtonClick(item: MenuItem) {
    this.dispatchEvent(new CustomEvent('app-selected', {detail: item}));
  }

  render() {
    const filteredItems = this.items.filter((item) =>
      item.name.toLowerCase().includes(this._search.toLowerCase())
    );
    return html`
      <div class="card">
        <obc-input
          placeholder="Search"
          icon="01-search"
          @input=${this.onSearchInput}
        ></obc-input>
        <div class="main-apps">
          ${filteredItems.map(
            (item) => html`
              <obc-app-button
                icon=${item.icon}
                label=${item.name}
                ?checked=${item.id === this.selectedItemId}
                @click=${() => this.onAppButtonClick(item)}
              ></obc-app-button>
            `
          )}
        </div>
      </div>
    `;
  }

  static styles = unsafeCSS(compentStyle);
}

declare global {
  interface HTMLElementTagNameMap {
    'obc-app-menu': AppMenu;
  }
}