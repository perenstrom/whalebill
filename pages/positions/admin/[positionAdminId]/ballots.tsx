import { AlertButton } from 'components/AlertButton';
import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { ListItem } from 'components/admin/ListItem';
import { getShortId } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { MouseEventHandler, useState } from 'react';
import { createBallot, deleteBallot } from 'services/local';
import { getAdminPosition } from 'services/prisma';
import styled from 'styled-components';
import { AdminPosition, UncreatedBallotItem } from 'types/types';

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

const EmptyText = styled.p`
  margin: 0;
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

interface Props {
  position: AdminPosition;
}

const PositionAdminPage: NextPage<Props> = ({ position }) => {
  const [ballot, setBallot] = useState<string[]>([]);
  const { ballots } = position;
  const latestBallot = ballots[ballots.length - 1];

  const getCandidate = (candidateId: string) =>
    position.candidates.find((candidate) => candidate.id === candidateId);
  const candidateIsSelected = (candidateId: string) =>
    ballot.includes(candidateId);

  const router = useRouter();

  const onSubmitBallot: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    const newBallotItems: UncreatedBallotItem[] = ballot.map(
      (candidateId, index) => ({
        candidateId,
        order: index
      })
    );

    try {
      await createBallot(position.id, newBallotItems);

      setBallot([]);
      router.replace(router.asPath);
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  const handleDeleteBallot = async (ballotId: string) => {
    try {
      await deleteBallot(position.id, ballotId);

      router.replace(router.asPath);
    } catch (error) {
      console.log('Something went wrong');
    }
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
          {ballot.length > 0 ? (
            <>
              <CandidateList>
                {ballot.map((ballotItemCandidateId, index) => (
                  <ListItem
                    key={ballotItemCandidateId}
                    heading={`${(index + 1).toString()}. ${
                      getCandidate(ballotItemCandidateId)?.name || ''
                    }`}
                    subHeading={getShortId(ballotItemCandidateId)}
                    onClick={() => {
                      const newBallot = [...ballot];
                      newBallot.splice(index, 1);
                      setBallot(newBallot);
                    }}
                  />
                ))}
              </CandidateList>
              <ButtonWrapper>
                <Button onClick={onSubmitBallot}>Save ballot</Button>
              </ButtonWrapper>
            </>
          ) : (
            <EmptyText>
              Click the candidates in the list to the left in order of first
              choice first.
            </EmptyText>
          )}
        </DashBoardCard>
        {ballots.length > 0 && (
          <DashBoardCard $variant="dark">
            <Heading>Latest ballot ({ballots.length} total)</Heading>
            <Divider />
            <CandidateList>
              {latestBallot.ballotItems.map((ballotItem) => (
                <ListItem
                  key={ballotItem.id}
                  heading={`${(ballotItem.order + 1).toString()}. ${
                    getCandidate(ballotItem.candidateId)?.name || ''
                  }`}
                  subHeading={getShortId(ballotItem.candidateId)}
                />
              ))}
            </CandidateList>
            <ButtonWrapper>
              <AlertButton onClick={() => handleDeleteBallot(latestBallot.id)}>
                Delete ballot
              </AlertButton>
            </ButtonWrapper>
          </DashBoardCard>
        )}

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
