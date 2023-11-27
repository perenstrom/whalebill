import styles from './TextInput.module.scss';

export const TextInput: React.FC<{
  id: string;
  label: string;
  defaultValue?: string;
}> = ({ id, label, defaultValue }) => {
  return (
    <>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.input}
        id={id}
        name={id}
        type="text"
        defaultValue={defaultValue}
      />
    </>
  );
};
