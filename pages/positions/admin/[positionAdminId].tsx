import { Position } from '@prisma/client';
import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { TextInput } from 'components/TextInput';
import { OpenPositionForm } from 'components/admin/OpenPositionForm';
import { getShortId } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { createCandidate, updatePosition } from 'services/local';
import { getAdminPosition } from 'services/prisma';
import styled from 'styled-components';
import { AdminPosition, UncreatedCandidate } from 'types/types';

interface Props {
  position: AdminPosition;
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const DashBoardCard = styled(Card)`
  max-width: 25rem;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.2rem;
  margin-top: 0;
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

const InputWrapper = styled.div`
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const CandidateList = styled.ul`
  list-style: none;
  margin: 0;
  margin-top: 1rem;
  padding: 0;
`;

const CandidateWrapper = styled.li`
  margin-left: -2rem;
  margin-right: -2rem;
  padding: 1rem 2rem;

  background: var(--color-gray-3);

  &:nth-child(odd) {
    background: var(--color-gray-2);
  }
`;

const CandidateHeading = styled.h3`
  font-size: 1.5rem;
  line-height: 1;
  margin: 0;
`;

const CandidateId = styled.span`
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;

const PositionAdminPage: NextPage<Props> = ({ position }) => {
  const router = useRouter();

  const onSubmitSettings = async (event: React.FormEvent<HTMLFormElement>) => {
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

  const onSubmitCandidate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newCandidate: UncreatedCandidate = {
      name: formData.get('candidateName') as string
    };

    try {
      await createCandidate(position.id, newCandidate);

      form.reset();
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
      <CardWrapper>
        <DashBoardCard $variant="dark">
          <Heading>Open position settings</Heading>
          <Divider />
          <OpenPositionForm
            onSubmit={onSubmitSettings}
            defaultValues={{
              name: position.name,
              openSeats: position.openSeats.toString()
            }}
          />
        </DashBoardCard>
        <DashBoardCard $variant="dark">
          <Heading>Candidates</Heading>
          <Divider />
          <CandidateList>
            {position.candidates
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((candidate) => (
                <CandidateWrapper key={candidate.id}>
                  <CandidateHeading>{candidate.name}</CandidateHeading>
                  <CandidateId>{getShortId(candidate.id)}</CandidateId>
                </CandidateWrapper>
              ))}
          </CandidateList>
          <form onSubmit={onSubmitCandidate}>
            <InputWrapper>
              <TextInput id="candidateName" label="Name" />
            </InputWrapper>

            <ButtonWrapper>
              <Button type="submit">Add candidate</Button>
            </ButtonWrapper>
          </form>
        </DashBoardCard>
      </CardWrapper>
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
