import { LitElement, html } from 'lit';
import { closeIcon } from '../../icons/closeIcon';
import { style } from './cb-drawer-style';
import '../cb-input/cb-input';
import '../cb-button/cb-button';
import { sendIcon } from '../../icons/sendIcon';
export class CbDrawer extends LitElement {
  static get properties() {
    return {
      /**
       * Is drawer open.
       * @type {boolean}
       */
      isOpen: { type: Boolean, attribute: true, reflect: true },
      /**
       * drawer header.
       * @type {string}
       */
      header: { type: String, attribute: true },
      /**
       * Id of message to replay
       * @type {string}
       */
      messageId: { type: String, attribute: true },
      /**
       * input value
       * @type {string}
       */
      value: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.isOpen = false;
    this.header = '';
  }

  static styles = [style];

  handleClose() {
    this.isOpen = false;
    const drawerEvent = new CustomEvent('closeDrawer', {
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(drawerEvent);
  }

  handleSendReplay() {
    const replay = new CustomEvent('replay', {
      detail: {
        replayText: this.value,
        replayToMessage: this.messageId,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(replay);
  }
  render() {
    const { header, handleSendReplay } = this;

    return html`
      <div class="header">
        <cb-button @click=${this.handleClose.bind(this)}>${closeIcon}</cb-button>
        <label> ${header}</label>
      </div>
      <div class="input-container">
        <cb-input
          @input=${e => (this.value = e.target.value)}
          placeholder="Replay to message"
        ></cb-input>
        <cb-button @click=${handleSendReplay}> ${sendIcon} </cb-button>
      </div>
    `;
  }
}

window.customElements.define('cb-drawer', CbDrawer);
