export const CbMixin = superClass =>
  class extends superClass {
    static properties = {};
    constructor() {
      super();

      this.isDrawer = false;
      this.messageToResponse = { messageText: '', messageId: '' };
    }
    connectedCallback() {
      super.connectedCallback();
      // console.log(`${this.localName} was connected`);
    }

    handleKeydown(event) {
      if (event.key === 'Enter' && event.shiftKey == false) {
        this.sendMessage();

        event.preventDefault();
      }
    }

    sendMessage(replayText) {
      const { name, message, socket, messageToResponse } = this;
      this.message = '';

      socket.emit('input', {
        name,
        message,
        replayText,
        replayToMessage: messageToResponse.messageId,
      });
    }

    updated(changedProperties) {
      super.updated?.(changedProperties);

      // console.log(`${this.localName} was updated`);
    }
  };
