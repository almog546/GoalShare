import styles from './Home.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to GoalShare</h1>
            <p className={styles.description}>
                Collaborate on your goals and manage recurring bills with ease.
            </p>
        </div>
    );
}
