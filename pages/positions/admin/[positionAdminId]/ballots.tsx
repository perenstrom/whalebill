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
import { CandidateId } from 'types/graph';
import { AdminPosition, UncreatedBallotItem } from 'types/types';
import styles from './ballots.module.scss';

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
    <div className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <Card variant="dark">
          <h2 className={styles.heading}>Candidates</h2>
          <Divider />
          <ul className={styles.candidateList}>
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
          </ul>
        </Card>
        <Card variant="dark">
          <h2 className={styles.heading}>New Ballot</h2>
          <Divider />
          {ballot.length > 0 ? (
            <>
              <ul className={styles.candidateList}>
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
              </ul>
              <div className={styles.buttonWrapper}>
                <Button onClick={onSubmitBallot}>Save ballot</Button>
              </div>
            </>
          ) : (
            <span className={styles.emptyText}>
              Click the candidates in the list to the left in order of first
              choice first.
            </span>
          )}
        </Card>
        {ballots.length > 0 && (
          <Card variant="dark">
            <h2 className={styles.heading}>
              Latest ballot ({ballots.length} total)
            </h2>
            <Divider />
            <ul className={styles.candidateList}>
              {latestBallot.ballotItems.map((ballotItem) => (
                <ListItem
                  key={ballotItem.id}
                  heading={`${(ballotItem.order + 1).toString()}. ${
                    getCandidate(ballotItem.candidateId)?.name || ''
                  }`}
                  subHeading={getShortId(ballotItem.candidateId)}
                />
              ))}
            </ul>
            <div className={styles.buttonWrapper}>
              <AlertButton onClick={() => handleDeleteBallot(latestBallot.id)}>
                Delete ballot
              </AlertButton>
            </div>
          </Card>
        )}

        <LinkButton href={`./graph`}>Move on &gt;&gt;</LinkButton>
      </div>
    </div>
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
