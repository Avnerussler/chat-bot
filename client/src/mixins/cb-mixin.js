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

    rateResponse(responseId) {
      const { socket } = this;
      socket.emit('rate-input', {
        responseId: responseId,
      });
    }

    updateState(state, id, fieldToUpdate, updateTo) {
      const objIndex = state.findIndex(obj => obj.id == id);
      state[objIndex][fieldToUpdate] = updateTo;
      this.requestUpdate();
      window.scrollTo({ top: 0 });
    }

    updated(changedProperties) {
      super.updated?.(changedProperties);

      // console.log(`${this.localName} was updated`);
    }
  };
