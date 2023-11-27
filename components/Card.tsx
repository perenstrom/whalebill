import { ComponentProps } from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';

export interface CardProps extends ComponentProps<'div'> {
  variant: 'light' | 'dark';
}
export const Card: React.FC<CardProps> = ({ variant, ...props }) => (
  <div
    className={clsx([
      styles.card,
      {
        [styles.light]: variant === 'light',
        [styles.dark]: variant === 'dark'
      }
    ])}
    {...props}
  />
);
