import { LitElement, html } from 'lit';
import { style } from './messageCardStyle';
import { messageIcon } from '../../icons/message-icon';
export class MessageCard extends LitElement {
  static get properties() {
    return {
      /**
       * The theme of the message, rather is my message or another user.
       * @type {string}
       */
      theme: { type: String },
      /**
       * Show replay.
       * @type {boolean}
       */
      isReplay: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.theme = '';
    this.isReplay = false;
  }

  static styles = [style];

  render() {
    const { theme, isReplay } = this;
    return html`
      <div class=${theme} @click=${() => (this.isReplay = !isReplay)}>
        ${isReplay ? html`<div class="replay">${messageIcon}</div>` : ''}
        ${isReplay ? html` <div style="width:20px" class="droer"></div>` : ''}
        <slot></slot>
      </div>
    `;
  }
}

window.customElements.define('message-card', MessageCard);
// @click=${() => this.clickToResponse(m.messageData.message, m.id)}
