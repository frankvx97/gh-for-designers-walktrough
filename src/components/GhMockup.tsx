import styles from './GhMockup.module.css';

interface Props {
  url: string;
  owner: string;
  repo: string;
  highlightFork?: boolean;
  showForkDropdown?: boolean;
  forkTargetOwner?: string;
}

export default function GhMockup({
  url,
  owner,
  repo,
  highlightFork = false,
  showForkDropdown = false,
  forkTargetOwner = 'your-username',
}: Props) {
  return (
    <div className={styles.frame}>
      <div className={styles.chrome}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.url}>{url}</span>
      </div>
      <div className={styles.repoHeader}>
        <svg className={styles.repoIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
        </svg>
        <span className={styles.repoOwner}>{owner}</span>
        <span className={styles.repoSlash}>/</span>
        <span className={styles.repoName}>{repo}</span>
        <span className={styles.repoTag}>Public</span>
        <div className={styles.actions}>
          <span className={styles.btn}>
            ⭐ Star <span className={styles.btnCount}>1.2k</span>
          </span>
          <span className={`${styles.btn} ${highlightFork ? styles.highlight : ''}`}>
            🍴 Fork <span className={styles.btnCount}>248</span>
          </span>
        </div>
      </div>

      {showForkDropdown && (
        <div className={styles.body}>
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              Create a new fork
              <div className={styles.dropdownSub}>
                A fork is a copy of a repository. Forking lets you make changes without affecting the original.
              </div>
            </div>
            <div className={styles.dropdownField}>
              <span className={styles.dropdownLabel}>Owner *</span>
              <span className={styles.dropdownValue}>{forkTargetOwner} ▾</span>
            </div>
            <div className={styles.dropdownField}>
              <span className={styles.dropdownLabel}>Repository name *</span>
              <span className={styles.dropdownValue}>{repo}</span>
            </div>
            <div className={styles.dropdownCta}>
              <span className={`${styles.btn} ${styles.primary}`}>Create fork</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
