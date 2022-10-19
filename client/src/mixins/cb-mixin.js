export const CbMixin = superClass =>
  class extends superClass {
    static properties = {};
    constructor() {
      super();

      this.isDrawer = false;
      this.messageToResponse = { messageText: '', messageId: '' };
    }

    dispatcher(name, data) {
      const event = new CustomEvent(name, {
        detail: data,
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(event);
    }

    handleSendReplay() {
      this.dispatcher('replay', { replayText: this.value });
      this.value = '';
      this.replayText = this.value;
    }

    handleKeydown(event, type) {
      if (event.key === 'Enter' && event.shiftKey == false) {
        switch (type) {
          case 'message':
            this.sendMessage();

            break;
          case 'response':
            this.handleSendReplay();
            break;
          default:
            break;
        }
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

    getRequest = async endPoint => {
      const result = await fetch(`http://localhost:3000/${endPoint}`);

      return result.json();
    };

    rateResponse(responseId) {
      const { socket } = this;

      socket.emit('rate-input', {
        responseId: responseId,
      });
    }

    updateState(state, id, fieldToUpdate, updateTo) {
      const objIndex = state.findIndex(obj => obj._id == id);
      state[objIndex][fieldToUpdate] = updateTo;
      this.requestUpdate();
    }
  };
