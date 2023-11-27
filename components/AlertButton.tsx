import { ComponentProps } from 'react';
import styles from './AlertButton.module.scss';

export const AlertButton: React.FC<ComponentProps<'button'>> = ({
  ...props
}) => <button className={styles.alertButton} {...props} />;
