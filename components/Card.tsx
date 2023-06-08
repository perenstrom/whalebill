import styled from 'styled-components';

interface Props {
  $variant: 'light' | 'dark';
}

export const Card = styled.div<Props>`
  padding: 2rem;
  border-radius: 5px;
  width: 100%;

  background: ${({ $variant }) =>
    $variant === 'light' ? 'var(--color-gray-3)' : 'var(--color-gray-1)'};
  border: 1px solid var(--color-gray-1);
  box-shadow: var(--shadow-elevation-high);
`;