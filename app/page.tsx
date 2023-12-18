import styles from './root.module.scss';

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperText}>
        <h1 className={styles.heading}>Instant-runoff voting, simplified</h1>
        <p className={styles.text}>
          <strong>Whalebill</strong> is a complete system for managing
          preferential voting elections using the instant-runoff voting
          electoral system. Unique to Whalebill is that after entering all
          ballots, the full decision tree is displayed.
        </p>
      </div>
      <div>
        <h2>Interested?</h2>
        <p>
          Send an email to{' '}
          <strong>
            <a href="mailto:hello@whalebill.app">hello@whalebill.app</a>
          </strong>{' '}
          and explain your use-case.
        </p>
      </div>
    </div>
  );
}
