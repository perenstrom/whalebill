import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { LinkButton } from 'components/LinkButton';
import { ListItem } from 'components/admin/ListItem';
import { getShortId } from 'helpers/copy';
import styles from './ballots.module.scss';
import { createBallot, deleteBallot, getAdminPosition } from 'services/prisma';
import { prismaContext } from 'lib/prisma';
import { redirect } from 'next/navigation';
import { BallotCandidates } from 'components/admin/ballots/BallotCandidates';
import { UncreatedBallotItem } from 'types/types';
import { getCandidate } from 'helpers/ballots';
import { revalidatePath } from 'next/cache';
import { DeleteBallot } from 'components/admin/ballots/DeleteBallot';

export default async function Page({
  params
}: {
  params: { positionAdminId: string };
}) {
  if (!params?.positionAdminId) {
    throw new Error('No team ID in params');
  }

  const position = await getAdminPosition(
    prismaContext,
    params?.positionAdminId
  );

  if (!position) {
    redirect('/create');
  }

  const { ballots } = position;
  const latestBallot = ballots[ballots.length - 1];

  const saveBallot = async (
    positionId: string,
    ballotItems: UncreatedBallotItem[]
  ) => {
    'use server';

    await createBallot(prismaContext, positionId, ballotItems);
    revalidatePath('/positions/admin/[positionAdminId]/ballots/page', 'page');
  };

  const handleDeleteBallot = async (ballotId: string) => {
    'use server';
    try {
      await deleteBallot(prismaContext, ballotId);

      revalidatePath('/positions/admin/[positionAdminId]/ballots/page', 'page');
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <BallotCandidates position={position} saveBallot={saveBallot} />
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
                    getCandidate(position, ballotItem.candidateId)?.name || ''
                  }`}
                  subHeading={getShortId(ballotItem.candidateId)}
                />
              ))}
            </ul>
            <div className={styles.buttonWrapper}>
              <DeleteBallot
                ballot={latestBallot}
                deleteBallot={handleDeleteBallot}
              />
            </div>
          </Card>
        )}

        <LinkButton href={`./graph`}>Move on &gt;&gt;</LinkButton>
      </div>
    </div>
  );
}
