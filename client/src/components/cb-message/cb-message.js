import { LitElement, html } from 'lit';
import { style } from './cb-message-style';
import { messageIcon } from '../../icons/message-icon';
import { CbMixin } from '../../mixins/cb-mixin';
export class CbMessage extends CbMixin(LitElement) {
  static get properties() {
    return {
      /**
       * The theme of the message, rather is my message or another user.
       * @type {string}
       */
      theme: { type: String },
      /**
       * Text of the message.
       * @type {string}
       */
      text: { type: String },
      /**
       * The ID of the message .
       * @type {string}
       */
      id: { type: String },
      /**
       * The number of the response .
       * @type {number}
       */
      response: { type: Number, attribute: true },
      /**
       * The type of the message.
       * @type {boolean}
       */
      isResponse: { type: Boolean, attribute: 'is-response' },
      /**
       * The number of the rate for this message .
       * @type {number}
       */
      rate: { type: Number, attribute: true },
    };
  }

  constructor() {
    super();
    this.response = 0;
    this.theme = '';
    this.text = '';
    this.id = '';
  }

  static styles = [style];

  handleOpenDrawerEvent() {
    const drawerEvent = new CustomEvent('openDrawer', {
      detail: {
        messageId: this.id,
        messageText: this.text,
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(drawerEvent);
  }

  handleRateEvent() {
    const rateEvent = new CustomEvent('rateEvent', {
      detail: {
        responseId: this.id,
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(rateEvent);
  }

  render() {
    const { theme, text, isResponse, rate } = this;
    return html`
      <div class=${theme}>
        <div class="replay" @click=${this.handleOpenDrawerEvent}>
          ${!isResponse ? messageIcon : ''}
        </div>
        <div>${text}</div>
        ${!isResponse && this.response > 0
          ? html` <div>There is ${this.response} responses</div>`
          : ''}
        ${isResponse ? html`<button @click=${this.handleRateEvent}>+1</button>` : ''}
        <div>${rate}</div>
      </div>
    `;
  }
}

window.customElements.define('cb-message', CbMessage);
