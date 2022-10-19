export const CbMixin = superClass =>
  class extends superClass {
    static properties = {};
    constructor() {
      super();

      this.isDrawer = false;
      this.messageToResponse = { messageText: '', messageId: '' };
    }

    handleSendReplay() {
      const replay = new CustomEvent('replay', {
        detail: {
          replayText: this.value,
        },
        bubbles: true,
        composed: true,
      });
      this.value = '';
      this.replayText = this.value;
      this.dispatchEvent(replay);
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
  };
