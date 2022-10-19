import { LitElement, html } from 'lit';
import { style } from './cb-container-style';
import '../cb-message/cb-message';
import '../cb-drawer/cb-drawer';
import '../cb-input/cb-input';
import '../cb-button/cb-button';
import { sendIcon } from '../../icons/sendIcon';
import { CbMixin } from '../../mixins/cb-mixin';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

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
    this.responses = [];

    (async () => {
      this.messagesData = await this.getRequest('getAllMessages');
    })();

    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    this.socket.on('new connection', console.log('new connection'));

    const output = data => {
      this.messagesData = [...this.messagesData, data];
    };

    this.socket.on('output', output);

    const response = data => {
      this.responses = [...this.responses, data];
    };

    this.socket.on('response', response);

    this.socket.on('update-messages', data => {
      this.updateState(this.messagesData, data.messageToUpdate, 'response', data.response);
    });

    this.socket.on('rate-output', data => {
      this.updateState(this.responses, data?._id, 'rate', data.rate);
    });
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

  async handleOpenDrawer(event) {
    const { messageId, messageText } = event.detail;

    this.messageToResponse = { messageId, messageText };
    this.isDrawer = true;

    const result = await this.getRequest(`getResponse/${messageId}`);
    this.responses = result[0].response;
    this.requestUpdate();
  }

  handleRate(event) {
    this.rateResponse(event.detail);
  }

  render() {
    const { message, isDrawer, messageToResponse, handleReplay, sendMessage } = this;

    return html`
      <div class="container">
        <div class="chat-container">
          <div class="header">Chat-Bot</div>
          <div class="message-list messages">
            ${this.messagesData
              ? this.messagesData.map(
                  m =>
                    html`
                      <cb-message
                        theme=${m.socketId === this.socket.id ? 'message my-message' : 'message'}
                        id=${m._id}
                        text=${m.message}
                        @openDrawer=${this.handleOpenDrawer}
                        response=${m.response?.length}
                      >
                      </cb-message>
                    `
                )
              : html`<div>Loading....</div>`}
          </div>

          <div class="input-container">
            <cb-input
              placeholder="Type a message"
              ?disabled=${isDrawer}
              .value=${message}
              @keydown=${event => this.handleKeydown(event, 'message')}
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
                /*Show response only for this message*/
                return html`
                  ${m.replayToMessage === messageToResponse.messageId
                    ? html` <cb-message
                        is-response
                        id=${m._id}
                        theme=${m.socketId === this.socket.id ? 'message my-message' : 'message'}
                        text=${m.replayText}
                        @rateEvent=${this.handleRate}
                        rate=${m.rate}
                      >
                      </cb-message>`
                    : ''}
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
