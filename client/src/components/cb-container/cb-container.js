import { LitElement, html } from 'lit';
import { style } from './cb-container-style';
import '../cb-message/cb-message';
import '../cb-drawer/cb-drawer';
import '../cb-input/cb-input';
import '../cb-button/cb-button';
import { sendIcon } from '../../icons/sendIcon';
import { CbMixin } from '../../mixins/cb-mixin';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

// store => data
// helper functions => add message update state AND update DOM

// https://dribbble.com/shots/16507884-Chatbot/attachments/11477943?mode=media
export class CbContainer extends CbMixin(LitElement) {
  static get properties() {
    return {
      /**
       * message content.
       * @type {string}
       */
      message: { type: String, state: true },
      /**
       * name of user.
       * @type {string}
       */
      name: { type: String, state: true },
      // /**
      //  * The current socket
      //  *
      //  * @type {string}
      //  */
      // socketId: { type: String },
      /**
       * messages state
       *
       * @type {array}
       */
      messagesData: { type: Array },
      /**
       * input value
       * @type {array}
       */
      responses: { type: Array, attribute: false },
    };
  }

  constructor() {
    super();
    this.name = '';
    this.message = '';
    // this.socketId = '';
    this.messagesData = [];
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    this.responses = [];
    this.socket.on('new connection', console.log('new connection'));

    const output = data => {
      this.messagesData = [...this.messagesData, data];
    };
    this.socket.on('output', output);

    const response = data => {
      this.responses = [...this.responses, data];
    };

    this.socket.on('response', response);
  }

  static styles = [style];

  handleReplay(event) {
    const { replayText } = event.detail;
    this.sendMessage(replayText);
  }

  handleCloseDrawer() {
    this.isDrawer = false;
    this.messageToResponse = { messageText: '', messageId: '' };
    this.responses = [];
    this.requestUpdate();
  }

  handleOpenDrawer(event) {
    const { messageId, messageText } = event.detail;
    this.messageToResponse = { messageId, messageText };

    this.isDrawer = true;

    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();

    addEventListener('keydown', this.handleKeydown.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  render() {
    const { message, isDrawer, messageToResponse, handleReplay, sendMessage } = this;

    return html`
      <div
        style="background:#f5f7fb;
                padding: 2rem 0;
                box-sizing: border-box;
                height: 100vh;
                overflow: hidden;
                "
      >
        <div class="container">
          <div class="message-list">
            ${this.messagesData.map(
              m =>
                html`
                  <cb-message
                    theme=${m.socketId === this.socket.id ? 'message my-message' : 'message'}
                    id=${m.id}
                    text=${m.message}
                    @openDrawer=${this.handleOpenDrawer}
                  >
                  </cb-message>
                `
            )}
          </div>

          <div class="input-container">
            <cb-input
              placeholder="Type a message"
              ?disabled=${isDrawer}
              .value=${message}
              @input=${e => (this.message = e.target.value)}
            ></cb-input>
            <cb-button @click=${sendMessage}> ${sendIcon} </cb-button>
          </div>

          <cb-drawer
            @replay=${handleReplay}
            @closeDrawer=${this.handleCloseDrawer}
            header=${messageToResponse.messageText}
            ?is-drawer=${isDrawer}
          >
            <div class="message-list">
              ${this.responses.map(m => {
                return html`
                  <cb-message
                    theme=${m.socketId === this.socket.id ? 'message my-message' : 'message'}
                    text=${m.replayText}
                  >
                  </cb-message>
                `;
              })}
            </div>
          </cb-drawer>
        </div>
      </div>
    `;
  }
}

window.customElements.define('cb-container', CbContainer);
