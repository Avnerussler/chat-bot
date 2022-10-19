import { css } from 'lit';

export const style = css`
  :host {
    display: flex;
    align-items: center;
  }
  .message {
    font-family: 'Varela Round', sans-serif;
    background-color: #f5f7fb;
    border-radius: 0px 7px 7px 7px;
    width: 40%;
    padding: 1rem;
    margin: 0.3rem 0;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;
  }

  .my-message {
    background-color: #4d426d;
    margin-left: auto;
    border-radius: 7px 0px 7px 7px;
    color: white;
  }

  :not(.my-message) .replay svg {
    stroke: black;
  }

  .replay {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }

  .responses {
    font-size: 12px;
    margin-top: 0.5rem;
  }

  .rate {
    font-size: 12px;
    margin-top: 0.5rem;
  }
`;
