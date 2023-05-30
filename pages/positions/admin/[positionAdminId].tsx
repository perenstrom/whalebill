import { Position } from '@prisma/client';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { OpenPositionForm } from 'components/admin/OpenPositionForm';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { updatePosition } from 'services/local';
import { getAdminPosition } from 'services/prisma';
import styled from 'styled-components';

interface Props {
  position: Position;
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
`;

const FormWrapper = styled.div`
  max-width: 30rem;
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.2rem;
`;

const Callout = styled.div`
  width: 100%;
  background: var(--color-accent-blue);
  padding: 0.7rem 1rem;
  border-radius: 4px;
  line-height: 1.3;
  border: 2px solid var(--color-accent-blue-light);
  box-shadow: var(--shadow-elevation-medium);

  margin-bottom: 2rem;
`;

const PositionAdminPage: NextPage<Props> = ({ position }) => {
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newPosition: Position = {
      id: position.id,
      adminId: position.adminId,
      name: formData.get('name') as string,
      openSeats: parseInt(formData.get('openSeats') as string, 10)
    };

    try {
      await updatePosition(position.id, newPosition);

      router.replace(router.asPath);
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  return (
    <Wrapper>
      <Callout>
        <b>Save this URL!</b> You will not be able to administer this election
        again without it.
      </Callout>
      <Card $variant="dark">
        <FormWrapper>
          <Heading>Open position settings</Heading>
          <Divider />
          <OpenPositionForm
            onSubmit={onSubmit}
            defaultValues={{
              name: position.name,
              openSeats: position.openSeats.toString()
            }}
          />
        </FormWrapper>
      </Card>
    </Wrapper>
  );
};

interface Params extends ParsedUrlQuery {
  positionAdminId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.positionAdminId) {
    throw new Error('No team ID in params');
  }

  const position = await getAdminPosition(
    prismaContext,
    context?.params?.positionAdminId
  );

  if (!position) {
    return {
      redirect: {
        destination: '/create',
        permanent: false
      }
    };
  }

  return {
    props: {
      position
    }
  };
};

export default PositionAdminPage;
