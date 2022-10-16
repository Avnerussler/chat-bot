import { LitElement, html } from 'lit';
import { style } from './cb-input-style';

export class CbInput extends LitElement {
  static get properties() {
    return {
      /**
       * input content.
       * @type {string}
       */
      value: { type: String },
      /**
       * input placeholder.
       * @type {string}
       */
      placeholder: { type: String },
      /**
       * Rather input is disabled or not.
       * @type {boolean}
       */
      disabled: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.placeholder = 'input..';
    this.disabled = false;
  }

  static styles = [style];

  render() {
    const { disabled, value, placeholder } = this;
    return html`
      <input
        class="input"
        .value=${value}
        @input=${e => (this.value = e.target.value)}
        placeholder=${placeholder}
        ?disabled=${disabled}
      />
    `;
  }
}

window.customElements.define('cb-input', CbInput);
