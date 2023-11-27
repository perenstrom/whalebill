import { ComponentProps } from 'react';
import styles from './Button.module.scss';

export const Button: React.FC<ComponentProps<'button'>> = ({ ...props }) => (
  <button className={styles.button} {...props} />
);
