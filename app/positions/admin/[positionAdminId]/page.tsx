import { prismaContext } from 'lib/prisma';
import { redirect } from 'next/navigation';

import styles from './positionAdmin.module.scss';
import { LinkButton } from 'components/LinkButton';
import {
  createCandidate,
  getAdminPosition,
  updatePosition
} from 'services/prisma';
import { UncreatedCandidate } from 'types/types';
import { revalidatePath } from 'next/cache';
import { Candidates } from 'components/admin/Candidates';
import { OpenPositionSettings } from 'components/admin/OpenPositionSettings';
import { Position } from '@prisma/client';

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

  const onSubmitSettings = async (formData: FormData) => {
    'use server';

    const newPosition: Position = {
      id: position.id,
      adminId: position.adminId,
      name: formData.get('name') as string,
      openSeats: parseInt(formData.get('openSeats') as string, 10),
      winnerPath: null
    };

    try {
      await updatePosition(prismaContext, newPosition);

      revalidatePath('/positions/admin/[positionAdminId]/page', 'page');
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  const onCreateCandidate = async (formData: FormData) => {
    'use server';

    const newCandidate: UncreatedCandidate = {
      name: formData.get('candidateName') as string
    };

    try {
      await createCandidate(prismaContext, {
        ...newCandidate,
        positionId: position.id
      });

      revalidatePath('/positions/admin/[positionAdminId]/page', 'page');
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
        <OpenPositionSettings
          position={position}
          saveSettings={onSubmitSettings}
        />
        <Candidates position={position} createCandidate={onCreateCandidate} />

        <LinkButton href={`./${position.adminId}/ballots`}>
          Move on &gt;&gt;
        </LinkButton>
      </div>
    </div>
  );
}
