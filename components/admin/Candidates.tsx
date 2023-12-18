'use client';
import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { TextInput } from 'components/TextInput';
import { getShortId } from 'helpers/copy';
import { ListItem } from './ListItem';
import styles from './Candidates.module.scss';
import { AdminPosition, ServerAction } from 'types/types';
import { useRef } from 'react';

interface Props {
  position: AdminPosition;
  createCandidate: ServerAction;
}

export const Candidates: React.FC<Props> = ({ position, createCandidate }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const onCreateCandidate = async (formData: FormData) => {
    await createCandidate(formData);
    formRef.current?.reset();
  };

  return (
    <Card variant="dark">
      <h2 className={styles.heading}>Candidates</h2>
      <Divider />
      <ul className={styles.candidateList}>
        {position.candidates
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((candidate) => (
            <ListItem
              key={candidate.id}
              heading={candidate.name}
              subHeading={getShortId(candidate.id)}
            />
          ))}
      </ul>
      <form action={onCreateCandidate} ref={formRef}>
        <div className={styles.inputWrapper}>
          <TextInput id="candidateName" label="Name" />
        </div>

        <div className={styles.buttonWrapper}>
          <Button type="submit">Add candidate</Button>
        </div>
      </form>
    </Card>
  );
};
