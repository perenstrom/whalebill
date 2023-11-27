import { ComponentProps } from 'react';
import styles from './Divider.module.scss';

export const Divider: React.FC<ComponentProps<'hr'>> = ({ ...props }) => (
  <hr className={styles.divider} {...props} />
);
