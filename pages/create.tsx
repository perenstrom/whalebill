import { TextInput } from 'components/TextInput';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createPosition } from 'services/local';
import styled from 'styled-components';
import { UncreatedPosition } from 'types/types';

const Wrapper = styled.div`
  padding: 2rem;
`;

const SubmitButton = styled.button`
  display: block;
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
      <h1>Register open position</h1>
      <form method="post" onSubmit={onSubmit}>
        <TextInput id="name" label="Position" />
        <TextInput id="openSeats" label="Open seats" />
        <SubmitButton type="submit">Save</SubmitButton>
      </form>
    </Wrapper>
  );
};

export default IndexPage;
