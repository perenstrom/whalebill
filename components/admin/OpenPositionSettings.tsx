import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { TextInput } from 'components/TextInput';
import { AdminPosition, ServerAction } from 'types/types';
import styles from './OpenPositionSettings.module.scss';

interface Props {
  position: AdminPosition;
  saveSettings: ServerAction;
}

export const OpenPositionSettings: React.FC<Props> = ({
  position,
  saveSettings
}) => {
  return (
    <Card variant="dark">
      <h2 className={styles.heading}>Open position settings</h2>
      <Divider />
      <form action={saveSettings}>
        <div className={styles.inputWrapper}>
          <TextInput id="name" label="Position" defaultValue={position.name} />
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
  );
};
