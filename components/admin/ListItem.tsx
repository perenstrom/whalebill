import styled from 'styled-components';

interface WrapperProps {
  $dimmed?: boolean;
  $interactive?: boolean;
}
const Wrapper = styled.li<WrapperProps>`
  margin-left: -2rem;
  margin-right: -2rem;
  padding: 1rem 2rem;
  cursor: ${({ $interactive = false }) => ($interactive ? 'pointer' : 'auto')};

  display: flex;
  align-items: center;

  background: var(--color-gray-3);

  &:nth-child(odd) {
    background: var(--color-gray-2);
  }

  color: ${({ $dimmed = false }) =>
    $dimmed ? 'var(--color-text-dark)' : 'inherit'};
`;

const Heading = styled.h3`
  font-size: 1.2rem;
  line-height: 1;
  margin: 0;
`;

const SubHeading = styled.span<WrapperProps>`
  display: block;
  font-size: 0.8rem;
  line-height: 1;
  margin-top: 0.2rem;

  color: ${({ $dimmed = false }) =>
    $dimmed ? 'var(--color-text-dark)' : 'var(--color-text-secondary)'};
`;

const KeyIcon = styled.div<WrapperProps>`
  width: 2.2rem;
  height: 2.2rem;
  border: 2px solid
    ${({ $dimmed = false }) =>
      $dimmed ? 'var(--color-accent-blue-dark)' : 'var(--color-accent-blue)'};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  margin-left: -0.5rem;
`;

export const ListItem: React.FC<{
  heading: string;
  subHeading?: string;
  keyIcon?: string;
  dimmed?: boolean;
  onClick?: () => void;
}> = ({ heading, subHeading, keyIcon, dimmed, onClick }) => {
  return (
    <Wrapper onClick={onClick} $dimmed={dimmed} $interactive={!!onClick}>
      {keyIcon && <KeyIcon $dimmed={dimmed}>{keyIcon}</KeyIcon>}
      <div>
        <Heading>{heading}</Heading>
        {subHeading && <SubHeading $dimmed={dimmed}>{subHeading}</SubHeading>}
      </div>
    </Wrapper>
  );
};
