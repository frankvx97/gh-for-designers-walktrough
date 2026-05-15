import styles from './ScanlinesOverlay.module.css';

export default function ScanlinesOverlay() {
  return (
    <>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />
    </>
  );
}
