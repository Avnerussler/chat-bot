import { LitElement, html } from 'lit';
import { style } from './cb-button-style';

export class CbButton extends LitElement {
  static get properties() {
    return {
      /**
       * The theme of the button.
       * @type {string}
       */
      theme: { type: String, attribute: true },
    };
  }

  constructor() {
    super();
  }

  static styles = [style];

  render() {
    return html`
      <button class="button">
        <slot></slot>
      </button>
    `;
  }
}

window.customElements.define('cb-button', CbButton);
