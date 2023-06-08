import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { ListItem } from 'components/admin/ListItem';
import { getShortId } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { MouseEventHandler, useState } from 'react';
import { getAdminPosition } from 'services/prisma';
import styled from 'styled-components';
import { AdminPosition } from 'types/types';

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

const PositionAdminPage: NextPage<Props> = ({ position }) => {
  const [ballot, setBallot] = useState<string[]>([]);

  const getCandidate = (candidateId: string) =>
    position.candidates.find((candidate) => candidate.id === candidateId);
  const candidateIsSelected = (candidateId: string) =>
    ballot.includes(candidateId);
  //const router = useRouter();

  const onSubmitBallot: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    /*     const form = event.currentTarget;
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
    } */
  };

  return (
    <Wrapper>
      <CardWrapper>
        <DashBoardCard $variant="dark">
          <Heading>Candidates</Heading>
          <Divider />
          <CandidateList>
            {position.candidates
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((candidate, index) => (
                <ListItem
                  key={candidate.id}
                  heading={candidate.name}
                  subHeading={getShortId(candidate.id)}
                  keyIcon={(index + 1).toString()}
                  onClick={
                    candidateIsSelected(candidate.id)
                      ? undefined
                      : () => {
                          const newBallot = [...ballot];
                          newBallot.push(candidate.id);
                          setBallot(newBallot);
                        }
                  }
                  dimmed={candidateIsSelected(candidate.id)}
                />
              ))}
          </CandidateList>
        </DashBoardCard>
        <DashBoardCard $variant="dark">
          <Heading>New Ballot</Heading>
          <Divider />
          <CandidateList>
            {ballot.map((ballotItemCandidateId, index) => (
              <ListItem
                key={ballotItemCandidateId}
                heading={`${(index + 1).toString()}. ${
                  getCandidate(ballotItemCandidateId)?.name || ''
                }`}
                subHeading={getShortId(ballotItemCandidateId)}
              />
            ))}
          </CandidateList>
          <ButtonWrapper>
            <Button onClick={onSubmitBallot}>Save ballot</Button>
          </ButtonWrapper>
        </DashBoardCard>

        <Button as="a" href={`./${position.adminId}/ballots`}>
          Move on &gt;&gt;
        </Button>
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
