import { css } from 'lit';

export const style = css`
  :host {
    --green-color: #3ca48b;
    --gray-background: #f5f7fb;
  }

  .container {
    background: var(--gray-background);
    padding: 2rem 0;
    box-sizing: border-box;
    height: 100vh;
    overflow: hidden;
  }

  .chat-container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
    width: 50%;
    margin: 0 auto;
    background: white;
    padding: 0 1.5rem 2rem;
    border-radius: 2rem;
    box-sizing: border-box;
    position: relative;
  }

  @media screen and (max-width: 1000px) {
    .chat-container {
      width: 90%;
    }
  }

  .message-list {
    overflow: scroll;

    height: 100%;
  }

  .messages {
    margin-top: 5.5rem;
  }

  .response {
    background: white;
    border-radius: 7px;
    padding: 0.2rem 0.3rem;
    margin: 0.2rem 0 0 1rem;
  }

  .input-container {
    padding-top: 2rem;
    display: flex;
    justify-content: space-between;
  }

  .message-response {
    display: flex;
  }

  .header {
    padding: 1rem 0;
    background-color: var(--green-color);
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 1;
    border-radius: 2rem 2rem 0 0;
    text-align: center;
    font-family: 'Varela Round', sans-serif;
    color: white;
    font-size: 30px;
  }
`;
