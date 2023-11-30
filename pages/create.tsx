import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { OpenPositionForm } from 'components/admin/OpenPositionForm';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createPosition } from 'services/local';
import { UncreatedPosition } from 'types/types';
import styles from './create.module.scss';

const IndexPage: NextPage<{}> = () => {
  const router = useRouter();
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const position: UncreatedPosition = {
      name: formData.get('name') as string,
      openSeats: parseInt(formData.get('openSeats') as string, 10)
    };

    try {
      const createdPosition = await createPosition(position);

      router.push(`/positions/admin/${createdPosition.adminId}`);
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card variant="light">
        <h1 className={styles.heading}>Register open position</h1>
        <Divider />
        <OpenPositionForm onSubmit={onSubmit} />
      </Card>
    </div>
  );
};

export default IndexPage;
