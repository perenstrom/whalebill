import { ComponentProps } from 'react';
import styles from './Button.module.scss';

export const LinkButton: React.FC<ComponentProps<'a'>> = ({ ...props }) => (
  <a className={styles.button} {...props} />
);
