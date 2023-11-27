import { AlertButton } from 'components/AlertButton';
import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { LinkButton } from 'components/LinkButton';
import { ListItem } from 'components/admin/ListItem';
import { getShortId } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { createBallot, deleteBallot } from 'services/local';
import { getAdminPosition } from 'services/prisma';
import styled from 'styled-components';
import { CandidateId } from 'types/graph';
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
  const [ballot, setBallot] = useState<CandidateId[]>([]);
  const { ballots } = position;
  const latestBallot = ballots[ballots.length - 1];

  const getCandidate = useCallback(
    (candidateId: CandidateId) =>
      position.candidates.find((candidate) => candidate.id === candidateId),
    [position.candidates]
  );
  const candidateIsSelected = useCallback(
    (candidateId: CandidateId) => ballot.includes(candidateId),
    [ballot]
  );

  const addCandidate = useCallback(
    (candidateId: CandidateId) => {
      const newBallot = [...ballot];
      newBallot.push(candidateId);
      setBallot(newBallot);
    },
    [ballot]
  );

  const removeCandidate = useCallback(
    (index: number) => {
      const newBallot = [...ballot];
      newBallot.splice(index, 1);
      setBallot(newBallot);
    },
    [ballot]
  );

  const router = useRouter();

  const saveBallot = useCallback(async () => {
    const newBallotItems: UncreatedBallotItem[] = ballot.map(
      (candidateId, index) => ({
        candidateId,
        candidateSmallId: getCandidate(candidateId)?.smallId || 0,
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
  }, [ballot, position.id, router, getCandidate]);

  const candidatesLength = position.candidates.length;
  const keyboardHandler = useCallback(
    (event: KeyboardEvent) => {
      if (position.candidates.length > 10) return;

      const digitKeyRegex = /Digit([0-9])/;
      const digitMatch = event.code.match(digitKeyRegex);
      const isDigit = !!digitMatch;
      const digit = digitMatch ? parseInt(digitMatch[1], 10) : undefined;

      if (isDigit && digit && digit <= candidatesLength) {
        event.shiftKey
          ? removeCandidate(digit - 1)
          : !candidateIsSelected(position.candidates[digit - 1].id) &&
            addCandidate(position.candidates[digit - 1].id);
        return;
      }

      if (event.code === 'Enter' && ballot.length > 0) {
        saveBallot();
      }
    },
    [
      addCandidate,
      ballot.length,
      candidateIsSelected,
      candidatesLength,
      position.candidates,
      removeCandidate,
      saveBallot
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyboardHandler, false);

    return () => {
      document.removeEventListener('keydown', keyboardHandler, false);
    };
  }, [keyboardHandler]);

  const onSubmitBallot: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    saveBallot();
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
        <Card variant="dark">
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
                  keyIcon={
                    position.candidates.length <= 10
                      ? (index + 1).toString()
                      : undefined
                  }
                  onClick={
                    candidateIsSelected(candidate.id)
                      ? undefined
                      : () => addCandidate(candidate.id)
                  }
                  dimmed={candidateIsSelected(candidate.id)}
                />
              ))}
          </CandidateList>
        </Card>
        <Card variant="dark">
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
                    onClick={() => removeCandidate(index)}
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
        </Card>
        {ballots.length > 0 && (
          <Card variant="dark">
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
          </Card>
        )}

        <LinkButton href={`./graph`}>Move on &gt;&gt;</LinkButton>
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
      position: { ...position, graph: null }
    }
  };
};

export default PositionAdminPage;
