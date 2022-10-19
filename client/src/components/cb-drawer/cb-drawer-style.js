import { css } from 'lit';

export const style = css`
  :host {
    --green-color: #3ca48b;

    backdrop-filter: blur(10px);
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    border-radius: 0 2rem 2rem 0;
    width: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    z-index: 3;
  }

  :host([is-drawer]) {
    transition: width 200ms ease-in-out;

    width: 20rem;
  }

  .header {
    background: var(--green-color);
    border-radius: 0px 2rem 0px 0px;
    display: flex;
    align-items: center;
    font-family: 'Varela Round', sans-serif;
    color: white;
  }
  .input-container {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem 1rem;
  }
`;
