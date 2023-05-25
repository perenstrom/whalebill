import styled from 'styled-components';

export const Button = styled.button`
  display: block;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  padding: 0.5rem 1rem;
  overflow: visible;
  text-transform: none;
  border: 0;
  border-radius: 3px;
  background: var(--color-accent-green);
  min-width: 8rem;

  &:hover {
    background: var(--color-accent-green-dark);
  }

  &:focus {
    outline: 2px solid var(--color-accent-green-light);
    outline-offset: 2px;
  }
`;
