import styles from './Logout.module.css';

export default function Logout({ user }) {
    return (
        <>
            {user ? (
                <h1 className={styles.title}>Logout Page</h1>
            ) : (
                <Navigate to="/signup" />
            )}
        </>
    );
}
