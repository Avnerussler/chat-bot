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
    };
  }

  constructor() {
    super();
    this.theme = '';
    this.text = '';
    this.id = '';
  }

  static styles = [style];
  handleOpenDrawer() {
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

  render() {
    const { theme, text } = this;
    return html`
      <div class=${theme}>
        <div class="replay" @click=${this.handleOpenDrawer}>${messageIcon}</div>
        ${text}
      </div>
    `;
  }
}

window.customElements.define('cb-message', CbMessage);
// @click=${() => this.clickToResponse(m.messageData.message, m.id)}
