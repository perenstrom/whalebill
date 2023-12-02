import { Position } from '@prisma/client';
import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { LinkButton } from 'components/LinkButton';
import { TextInput } from 'components/TextInput';
import { ListItem } from 'components/admin/ListItem';
import { getShortId } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { createCandidate, updatePosition } from 'services/local';
import { getAdminPosition } from 'services/prisma';
import { AdminPosition, UncreatedCandidate } from 'types/types';
import styles from './index.module.scss';

interface Props {
  position: AdminPosition;
}

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
      openSeats: parseInt(formData.get('openSeats') as string, 10),
      winnerPath: null
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
    <div className={styles.wrapper}>
      <div className={styles.callout}>
        <b>Save this URL!</b> You will not be able to administer this election
        again without it.
      </div>
      <div className={styles.cardWrapper}>
        <Card variant="dark">
          <h2 className={styles.heading}>Open position settings</h2>
          <Divider />
          <form onSubmit={onSubmitSettings}>
            <div className={styles.inputWrapper}>
              <TextInput
                id="name"
                label="Position"
                defaultValue={position.name}
              />
            </div>
            <div className={styles.inputWrapper}>
              <TextInput
                id="openSeats"
                label="Open seats"
                defaultValue={position.openSeats.toString()}
              />
            </div>
            <div className={styles.buttonWrapper}>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Card>
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
          <form onSubmit={onSubmitCandidate}>
            <div className={styles.inputWrapper}>
              <TextInput id="candidateName" label="Name" />
            </div>

            <div className={styles.buttonWrapper}>
              <Button type="submit">Add candidate</Button>
            </div>
          </form>
        </Card>

        <LinkButton href={`./${position.adminId}/ballots`}>
          Move on &gt;&gt;
        </LinkButton>
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
      position
    }
  };
};

export default PositionAdminPage;
