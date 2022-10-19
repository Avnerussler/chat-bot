import { css } from 'lit';

export const style = css`
  :host {
    backdrop-filter: blur(10px);
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    border-radius: 0 2rem 2rem 0;
    width: 20rem;
    opacity: 0;
    margin-right: -20rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    z-index: 3;
  }

  :host([is-drawer]) {
    transition: margin-right 300ms ease-in-out;
    opacity: 1;
    margin-right: 0;
  }

  .header {
    background: #3ca38b;
    border-radius: 0px 2rem 0px 0px;
    display: flex;
    align-items: center;
    font-family: 'Varela Round', sans-serif;
  }
  .input-container {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem 1rem;
  }
`;
