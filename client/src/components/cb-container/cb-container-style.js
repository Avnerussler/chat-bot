import { css } from 'lit';

export const style = css`
  .container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
    width: 50%;
    margin: 0 auto;
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 2rem;
    box-sizing: border-box;
    position: relative;
  }

  @media screen and (max-width: 1000px) {
    .container {
      width: 90%;
    }
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
    justify-content: space-between;
  }

  .message-response {
    display: flex;
  }

  .close {
  }
`;
