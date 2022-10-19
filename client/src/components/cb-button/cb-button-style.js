import { css } from 'lit';

export const style = css`
  :host {
    width: 20%;
  }
  .button {
    width: 100%;
    background: #3ca48b;
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;
    border-radius: 7px;
    display: flex;
    justify-content: center;
    color: white;
  }
  ::slotted(*) {
    width: 52px;
  }
`;

//   .input,
//   :disabled {
//     cursor: not-allowed;
//   }
