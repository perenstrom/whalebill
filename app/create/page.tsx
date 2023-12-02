import { UncreatedPosition } from 'types/types';
import styles from './create.module.scss';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { OpenPositionForm } from 'components/admin/OpenPositionForm';
import { redirect } from 'next/navigation';
import { createPosition } from 'services/prisma';
import { prismaContext } from 'lib/prisma';
import { isRedirectError } from 'next/dist/client/components/redirect';

export default function Page() {
  async function create(formData: FormData) {
    'use server';

    const position: UncreatedPosition = {
      name: formData.get('name') as string,
      openSeats: parseInt(formData.get('openSeats') as string, 10)
    };

    try {
      const createdPosition = await createPosition(prismaContext, position);

      redirect(`/positions/admin/${createdPosition.adminId}`);
    } catch (error) {
      if (isRedirectError(error)) throw error;

      console.log('Something went wrong');
      console.log(error);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Card variant="light">
        <h1 className={styles.heading}>Register open position</h1>
        <Divider />
        <OpenPositionForm action={create} />
      </Card>
    </div>
  );
}
