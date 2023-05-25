import styled from 'styled-components';

const Label = styled.label`
  display: block;
`;

const Input = styled.input`
  width: 100%;
  border: 0;
  border-radius: 3px;

  &:focus {
    outline: 2px solid var(--color-accent-green-light);
    outline-offset: 2px;
  }
`;

export const TextInput: React.FC<{
  id: string;
  label: string;
  defaultValue?: string;
}> = ({ id, label, defaultValue }) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type="text" defaultValue={defaultValue} />
    </>
  );
};
