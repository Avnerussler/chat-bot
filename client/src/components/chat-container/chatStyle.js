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
    padding: 0.5rem;
  }
  .chat-button {
    width: 10%;
  }

  .chat-input {
    width: 80%;
  }
`;
