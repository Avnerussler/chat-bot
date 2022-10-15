import { LitElement, html } from 'lit';
import { style } from './chatStyle';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
import '../message-card/message-card';
import { sendIcon } from '../../icons/sendIcon';
// store => data
// helper functions => add message update state AND update DOM

// https://dribbble.com/shots/16507884-Chatbot/attachments/11477943?mode=media
export class ChatContainer extends LitElement {
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

      // TODO:change to one object
      /**
       * The message you want to response.
       *
       * @type {string}
       */
      idToResponse: { type: String },
      /**
       * The message you want to response.
       *
       * @type {string}
       */
      messageToResponse: { type: String },
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
    };
  }

  constructor() {
    super();
    this.name = '';
    this.message = '';
    this.messageToResponse = '';
    this.idToResponse = '';
    this.socketId = '';
    this.messagesData = [];
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    this.socket.on('new connection', id => ((this.socketId = id), console.log('new connection')));

    // Handle Output
    const output = data => {
      this.messagesData = [...this.messagesData, data];
    };

    this.socket.on('output', output);

    const response = data => {
      const messageEl = this.shadowRoot.getElementById(`${data.messageToResponse}`);
      const newResponse = document.createElement('div');
      newResponse.innerText = data.message;
      newResponse.className = 'response';

      messageEl.appendChild(newResponse);
    };

    this.socket.on('response', response);
  }

  static styles = [style];

  clickToResponse(message, id) {
    console.log('click', message, id);
    this.idToResponse = id;
    this.messageToResponse = message;
  }

  socketSend() {
    const { name, message, socket, idToResponse } = this;
    this.message = '';
    this.messageToResponse = '';
    this.idToResponse = '';

    socket.emit('input', {
      name,
      message,
      messageToResponse: idToResponse,
    });
  }

  handleKeydown(event) {
    if (event.key === 'Enter' && event.shiftKey == false) {
      this.socketSend();

      event.preventDefault();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    addEventListener('keydown', this.handleKeydown.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('keydown', this.handleKeydown.bind(this));
  }
  removeMessageToAnswer() {
    this.messageToResponse = '';
    this.idToResponse = '';
  }

  render() {
    const { messageToResponse, message } = this;

    return html` <div
      style="background:#f5f7fb;
    padding: 2rem 0;
    box-sizing: border-box;    height: 100vh;
    
  
    "
    >
      <div class="container">
        <div class="message-list">
          ${this.messagesData.map(m => {
            // console.log(m);
            return html`
              <message-card
                theme=${m.socketId === this.socket.id ? 'message my-message' : 'message'}
              >
                ${m.messageData.message}
              </message-card>
            `;
          })}
        </div>

        <div class="input-container">
          <input
            .value=${message}
            @input=${e => (this.message = e.target.value)}
            placeholder="Type a message"
            class="chat-input"
            id="message-input"
          />
          <button @click=${this.socketSend} class="chat-button">${sendIcon}</button>
        </div>
      </div>
    </div>`;
  }
}

window.customElements.define('chat-container', ChatContainer);

{
  /* <input
@change=${e => (this.name = e.target.value)}
type="text"
id="username"
class="form-control"
placeholder="Enter name..."
/> */
}

{
  /* <div class="message-response ">
          <div>${messageToResponse}</div>
          <div class="clos" @click=${this.removeMessageToAnswer}>
            ${messageToResponse ? 'x' : ''}
          </div>
        </div> */
}
