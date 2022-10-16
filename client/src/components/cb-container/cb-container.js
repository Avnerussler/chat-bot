import { LitElement, html } from 'lit';
import { style } from './cb-container-style';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
import '../cb-message/cb-message';
import '../cb-drawer/cb-drawer';
import '../cb-input/cb-input';
import '../cb-button/cb-button';
import { sendIcon } from '../../icons/sendIcon';
// store => data
// helper functions => add message update state AND update DOM

// https://dribbble.com/shots/16507884-Chatbot/attachments/11477943?mode=media
export class CbContainer extends LitElement {
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

      /**
       * The message you want to response.
       *
       * @type {object}
       */
      messageToResponse: { type: Object },
      /**
       * The current socket
       *
       * @type {string}
       */
      socketId: { type: String },
      /**
       * messages state
       *
       * @type {array}
       */
      messagesData: { type: Array },
      /**
       * Is drawer open or close.
       *
       * @type {boolean}
       */
      isDrawer: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.name = '';
    this.message = '';
    this.messageToResponse = { messageText: '', messageId: '' };

    this.socketId = '';
    this.messagesData = [];
    this.isDrawer = false;
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    this.socket.on('new connection', id => ((this.socketId = id), console.log('new connection')));
    const output = data => {
      this.messagesData = [...this.messagesData, data];
    };
    this.socket.on('output', output);

    const response = data => {
      console.log(data);
    };

    this.socket.on('response', response);
  }

  static styles = [style];

  handleOpenDrawer(event) {
    const { messageId, messageText } = event.detail;
    this.messageToResponse = { messageId, messageText };
    this.isDrawer = true;
  }

  handleReplay(event) {
    const { socket } = this;
    const { replayText, replayToMessage } = event.detail;
    socket.emit('input', {
      replayToMessage,
      message: replayText,
    });
  }

  handleKeydown(event) {
    if (event.key === 'Enter' && event.shiftKey == false) {
      this.sendMessage();

      event.preventDefault();
    }
  }

  sendMessage() {
    const { name, message, socket } = this;
    this.message = '';

    socket.emit('input', {
      name,
      message,
    });
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
    const { message, isDrawer, messageToResponse, handleReplay, sendMessage, handleOpenDrawer } =
      this;
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
                    text=${m.messageData.message}
                    @openDrawer=${handleOpenDrawer}
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
            @closeDrawer=${() => (this.isDrawer = false)}
            @replay=${handleReplay}
            header=${messageToResponse.messageText}
            messageid=${messageToResponse.messageId}
            ?isopen=${isDrawer}
          ></cb-drawer>
        </div>
      </div>
    `;
  }
}

window.customElements.define('cb-container', CbContainer);
