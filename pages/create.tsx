import { Button } from 'components/Button';
import { Divider } from 'components/Divider';
import { TextInput } from 'components/TextInput';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createPosition } from 'services/local';
import styled from 'styled-components';
import { UncreatedPosition } from 'types/types';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  max-width: 30rem;
  padding: 2rem;
  border-radius: 5px;

  background: var(--color-gray-3);
  border: 1px solid var(--color-gray-1);
  box-shadow: var(--shadow-elevation-high);
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.2rem;
`;

const InputWrapper = styled.div`
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const IndexPage: NextPage<{}> = () => {
  const router = useRouter();
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const position: UncreatedPosition = {
      name: formData.get('name') as string,
      openSeats: parseInt(formData.get('openSeats') as string, 10)
    };

    try {
      const createdPosition = await createPosition(position);

      router.push(`/${createdPosition.id}`);
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  return (
    <Wrapper>
      <Card>
        <Heading>Register open position</Heading>
        <Divider />
        <form method="post" onSubmit={onSubmit}>
          <InputWrapper>
            <TextInput id="name" label="Position" />
          </InputWrapper>
          <InputWrapper>
            <TextInput id="openSeats" label="Open seats" />
          </InputWrapper>
          <ButtonWrapper>
            <Button type="submit">Save</Button>
          </ButtonWrapper>
        </form>
      </Card>
    </Wrapper>
  );
};

export default IndexPage;
