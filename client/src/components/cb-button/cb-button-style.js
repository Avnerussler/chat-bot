import { css } from 'lit';

export const style = css`
  :host {
    width: 20%;
    --green: #3ca48b;
  }
  .button {
    width: 100%;
    background: var(--green);
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
