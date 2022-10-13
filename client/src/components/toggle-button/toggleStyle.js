import { css } from 'lit';

export const buttonStyles = css`
  button {
    background-color: #80808038;
    border: none;
    curser: pointer;
    border-radius: 100%;
    padding: 0.5rem;
    cursor: pointer;
    position: absolute;
    right: 20px;
    outline: 2px solid;
    animation: up-down 2s infinite;
  }
  .open {
    animation-play-state: paused;
    bottom: 20px !important;
  }
  @keyframes up-down {
    0%,
    100% {
      bottom: 20px;
    }
    50% {
      bottom: 30px;
    }
  }

  svg {
    width: 3rem;
  }
`;
