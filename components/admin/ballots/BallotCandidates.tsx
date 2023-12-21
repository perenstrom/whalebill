'use client';

import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { getShortId } from 'helpers/copy';
import { ListItem } from '../ListItem';
import styles from './BallotCandidates.module.scss';
import { AdminPosition, UncreatedBallotItem } from 'types/types';
import { useCallback, useEffect, useState } from 'react';
import { CandidateId } from 'types/graph';
import { Button } from 'components/Button';
import { getCandidate } from 'helpers/ballots';

interface Props {
  position: AdminPosition;
  saveBallot: (positionId: string, ballotItems: UncreatedBallotItem[]) => void;
}

export const BallotCandidates: React.FC<Props> = ({ position, saveBallot }) => {
  const [ballot, setBallot] = useState<CandidateId[]>([]);

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

  const onSaveBallot = useCallback(async () => {
    const newBallotItems: UncreatedBallotItem[] = ballot.map(
      (candidateId, index) => ({
        candidateId,
        candidateSmallId: getCandidate(position, candidateId)?.smallId || 0,
        order: index
      })
    );

    try {
      await saveBallot(position.id, newBallotItems);

      setBallot([]);
    } catch (error) {
      console.log('Something went wrong');
    }
  }, [ballot, position, saveBallot]);

  const candidatesLength = position.candidates.length;
  const keyboardHandler = useCallback(
    (event: KeyboardEvent) => {
      if (candidatesLength > 10) return;

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
        onSaveBallot();
      }
    },
    [
      addCandidate,
      ballot.length,
      candidateIsSelected,
      candidatesLength,
      onSaveBallot,
      position.candidates,
      removeCandidate
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyboardHandler, false);

    return () => {
      document.removeEventListener('keydown', keyboardHandler, false);
    };
  }, [keyboardHandler]);

  return (
    <>
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
                    getCandidate(position, ballotItemCandidateId)?.name || ''
                  }`}
                  subHeading={getShortId(ballotItemCandidateId)}
                  onClick={() => removeCandidate(index)}
                />
              ))}
            </ul>
            <div className={styles.buttonWrapper}>
              <Button onClick={() => onSaveBallot()}>Save ballot</Button>
            </div>
          </>
        ) : (
          <p className={styles.emptyText}>
            Click the candidates in the list to the left in order of first
            choice first.
          </p>
        )}
      </Card>
    </>
  );
};
