import { css } from 'lit';

export const style = css`
  .close {
    display: none;
  }

  .open {
    display: block;
    background: red;
    height: 30rem;
    width: 17rem;
    bottom: 95px;
    right: 20px;
    position: absolute;
  }

  .container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
    width: 66%;
    margin: 0 auto;
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 2rem;
    box-sizing: border-box;
  }

  .chat-button {
    width: 10%;
    background: #3ca48b;
    border: none;

    padding: 0.5rem 0;
    border-radius: 7px;
    display: flex;
    justify-content: center;
  }

  .chat-input {
    width: 80%;
    padding: 0.5rem 1rem;

    background: #f5f7fb;
    border-radius: 7px;
    border: none;
  }

  .message-list {
    overflow: scroll;
  }
  .response {
    background: white;
    border-radius: 7px;
    padding: 0.2rem 0.3rem;
    margin: 0.2rem 0 0 1rem;
  }

  .input-container {
    display: flex;
    justify-content: space-around;
  }

  .message-response {
    display: flex;
  }

  .close {
  }
`;
