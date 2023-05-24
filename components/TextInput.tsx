import styled from 'styled-components';

const Label = styled.label`
  display: block;
`;

export const TextInput: React.FC<{ id: string; label: string }> = ({
  id,
  label
}) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} name={id} type="text" />
    </>
  );
};
