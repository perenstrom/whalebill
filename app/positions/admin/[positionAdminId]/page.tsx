import { prismaContext } from 'lib/prisma';
import { redirect } from 'next/navigation';

import styles from './positionAdmin.module.scss';
import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { LinkButton } from 'components/LinkButton';
import { TextInput } from 'components/TextInput';
import { createCandidate, getAdminPosition } from 'services/prisma';
import { UncreatedCandidate } from 'types/types';
import { revalidatePath } from 'next/cache';
import { Candidates } from 'components/admin/Candidates';

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

  /* const onSubmitSettings = async () => {
    return;
  }; */

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

      // form.reset();
      revalidatePath('/positions/admin/[positionAdminId]/page', 'page');
    } catch (error) {
      console.log('Something went wrong');
    }
    return;
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
          <form>
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
        <Candidates position={position} createCandidate={onCreateCandidate} />

        <LinkButton href={`./${position.adminId}/ballots`}>
          Move on &gt;&gt;
        </LinkButton>
      </div>
    </div>
  );
}
