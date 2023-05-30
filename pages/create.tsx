import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { OpenPositionForm } from 'components/admin/OpenPositionForm';
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

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.2rem;
`;

const CreateCard = styled(Card)`
  max-width: 30rem;
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

      router.push(`/positions/admin/${createdPosition.adminId}`);
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  return (
    <Wrapper>
      <CreateCard $variant="light">
        <Heading>Register open position</Heading>
        <Divider />
        <OpenPositionForm onSubmit={onSubmit} />
      </CreateCard>
    </Wrapper>
  );
};

export default IndexPage;
