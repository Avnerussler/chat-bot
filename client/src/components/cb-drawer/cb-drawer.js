import { LitElement, html } from 'lit';
import { closeIcon } from '../../icons/closeIcon';
import { style } from './cb-drawer-style';
import '../cb-input/cb-input';
import '../cb-button/cb-button';
import { sendIcon } from '../../icons/sendIcon';
import { CbMixin } from '../../mixins/cb-mixin';
export class CbDrawer extends CbMixin(LitElement) {
  static get properties() {
    return {
      /**
       * Is drawer open or close.
       *
       * @type {boolean}
       */
      isDrawer: { attribute: 'is-drawer', type: Boolean },
      /**
       * drawer header.
       * @type {string}
       */
      header: { type: String, attribute: true },

      /**
       * input value
       * @type {string}
       */
      value: { type: String, attribute: false },
      /**
       * input value
       * @type {array}
       */
      responses: { type: Array, attribute: false },
      /**
       * input value
       * @type {string}
       */
      socketId: { attribute: 'socket-id', type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.value = '';
  }

  static styles = [style];

  handleCloseDrawer() {
    this.dispatcher('closeDrawer');
  }

  render() {
    const { header, handleSendReplay } = this;

    return html`
      <div class="header">
        <cb-button @click=${this.handleCloseDrawer}> ${closeIcon}</cb-button>
        <label> ${header}</label>
      </div>

      <slot></slot>

      <div class="input-container">
        <cb-input
          @input=${e => (this.value = e.target.value)}
          placeholder="Replay to message"
          .value=${this.value}
          @keydown=${event => this.handleKeydown(event, 'response')}
        ></cb-input>
        <cb-button @click=${handleSendReplay}> ${sendIcon} </cb-button>
      </div>
    `;
  }
}

window.customElements.define('cb-drawer', CbDrawer);
