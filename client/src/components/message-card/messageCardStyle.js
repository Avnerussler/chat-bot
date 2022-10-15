import { css } from 'lit';

export const style = css`
  .message {
    font-family: 'Varela Round', sans-serif;
    background-color: #f5f7fb;
    border-radius: 0px 7px 7px 7px;
    width: 40%;
    padding: 1rem;
    margin: 0.3rem 0;
    cursor: pointer;
    position: relative;
  }

  .my-message {
    background-color: #4d426d;
    margin-left: auto;
    border-radius: 7px 0px 7px 7px;
    color: white;
  }

  .replay {
    position: absolute;
    right: 0;
    top: -24px;
    z-index: 10;
  }
`;
