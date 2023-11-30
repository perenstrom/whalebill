import { Button } from 'components/Button';
import { TextInput } from 'components/TextInput';
import { FormEventHandler } from 'react';
import styles from './OpenPositionForm.module.scss';

export const OpenPositionForm: React.FC<{
  defaultValues?: {
    name: string;
    openSeats: string;
  };
  onSubmit: FormEventHandler<HTMLFormElement>;
}> = ({ defaultValues, onSubmit }) => {
  return (
    <form method="post" onSubmit={onSubmit}>
      <div className={styles.inputWrapper}>
        <TextInput
          id="name"
          label="Position"
          defaultValue={defaultValues?.name}
        />
      </div>
      <div className={styles.inputWrapper}>
        <TextInput
          id="openSeats"
          label="Open seats"
          defaultValue={defaultValues?.openSeats}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
