import styles from './ProgressBar.module.css';

export default function ProgressBar({ current, target }) {
    const percentage = Math.min((current / target) * 100, 100);

    return (
        <div className={styles.container}>
            <div className={styles.bar} style={{ width: `${percentage}%` }} />
            <span className={styles.label}>{Math.round(percentage)}%</span>
        </div>
    );
}
