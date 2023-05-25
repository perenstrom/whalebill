import { Button } from 'components/Button';
import { TextInput } from 'components/TextInput';
import { FormEventHandler } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

export const OpenPositionForm: React.FC<{
  defaultValues?: {
    name: string;
    openSeats: string;
  };
  onSubmit: FormEventHandler<HTMLFormElement>;
}> = ({ defaultValues, onSubmit }) => {
  return (
    <form method="post" onSubmit={onSubmit}>
      <InputWrapper>
        <TextInput
          id="name"
          label="Position"
          defaultValue={defaultValues?.name}
        />
      </InputWrapper>
      <InputWrapper>
        <TextInput
          id="openSeats"
          label="Open seats"
          defaultValue={defaultValues?.openSeats}
        />
      </InputWrapper>
      <ButtonWrapper>
        <Button type="submit">Save</Button>
      </ButtonWrapper>
    </form>
  );
};
