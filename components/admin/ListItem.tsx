import styles from './ListItem.module.scss';
import clsx from 'clsx';

export const ListItem: React.FC<{
  heading: string;
  subHeading?: string;
  keyIcon?: string;
  dimmed?: boolean;
  onClick?: () => void;
}> = ({ heading, subHeading, keyIcon, dimmed, onClick }) => {
  return (
    <li
      className={clsx([
        styles.wrapper,
        { [styles.dimmed]: dimmed },
        { [styles.interactive]: !!onClick }
      ])}
      onClick={onClick}
    >
      {keyIcon && (
        <div
          className={clsx([styles.keyIcon, { [styles.keyIconDimmed]: dimmed }])}
        >
          {keyIcon}
        </div>
      )}
      <div>
        <h3 className={styles.heading}>{heading}</h3>
        {subHeading && (
          <span
            className={clsx([styles.subHeading, { [styles.dimmed]: dimmed }])}
          >
            {subHeading}
          </span>
        )}
      </div>
    </li>
  );
};
