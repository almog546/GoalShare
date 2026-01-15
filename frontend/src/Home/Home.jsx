import styles from './Home.module.css';
import { Link } from 'react-router-dom';

export default function Home({ user }) {
    return (
        <>
            {user ? (
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        Welcome,{user.name} let’s build something together!
                    </h1>
                    <button
                        className={styles.createGroupButton}
                        onClick={() => (window.location.href = '/create-group')}
                    >
                        Create a Group
                    </button>
                </div>
            ) : (
                <div className={styles.container}>
                    <h1 className={styles.title}>Welcome to GoalShare!</h1>
                    <p className={styles.subtitle}>
                        Please log in or sign up to start sharing your goals.
                        <Link to="/login" className={styles.loginLink}>
                            Login
                        </Link>{' '}
                        or
                        <Link to="/signup" className={styles.signupLink}>
                            Signup
                        </Link>
                    </p>
                </div>
            )}
        </>
    );
}
