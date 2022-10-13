import { LitElement, html } from 'lit';
import { buttonStyles } from './toggleStyle';
import { botIcon } from '../../icons/botIcon';
import { closeIcon } from '../../icons/closeIcon';

export class ToggleButton extends LitElement {
  static get properties() {
    return {
      /**
       * isOpen - boolean.
       * @type {boolean}
       */
      isOpen: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.isOpen = false;
  }

  static styles = [buttonStyles];

  onButtonClick() {
    this.isOpen = !this.isOpen;
    const event = new CustomEvent('toggle', { detail: this.isOpen });
    document.dispatchEvent(event);
  }

  getIcon() {
    const { isOpen } = this;
    if (isOpen) {
      return html`${closeIcon} `;
    } else {
      return html`${botIcon}`;
    }
  }

  render() {
    const { isOpen } = this;
    return html`
      <button class="button  ${isOpen ? 'open' : 'close'}" @click="${this.onButtonClick}">
        ${this.getIcon()}
      </button>
    `;
  }
}

window.customElements.define('toggle-button', ToggleButton);
