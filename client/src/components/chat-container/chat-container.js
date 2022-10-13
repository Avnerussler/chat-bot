import { LitElement, html } from 'lit';
import { style } from './chatStyle';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

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
      /**
       * data.
       * @type {object}
       */
      data: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this.name = '';
    this.message = '';
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    this.socket.on('new connection', console.log);
  }

  static styles = [style];

  socketSend() {
    const { name, message, socket } = this;

    socket.emit('input', {
      name,
      message,
    });

    if (socket != undefined) {
      // Handle Output
      const listener = data => {
        if (Object.entries(data).length) {
          console.log(data);

          const newElement = document.createElement('div');
          newElement.innerText = data.name;
          document.body.appendChild(newElement);
        }
      };

      socket.on('output', listener);
    }
  }

  handleKeydown(event) {
    if (event.key === 'Enter' && event.shiftKey == false) {
      console.log('event');

      // this.socketSend();

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

  render() {
    console.log(this.data);
    return html` <div>
      <div class="container">
        <input
          @change=${e => (this.name = e.target.value)}
          type="text"
          id="username"
          class="form-control"
          placeholder="Enter name..."
        />
        <br />
        <div class="card">
          <div id="messages" class="card-block"></div>
        </div>
        <br />
        <input
          @change=${e => (this.message = e.target.value)}
          placeholder="Enter message..."
          class="chat-input"
        />
        <button @click=${this.socketSend} class="chat-button">send</button>
      </div>
    </div>`;
  }
}

window.customElements.define('chat-container', ChatContainer);
