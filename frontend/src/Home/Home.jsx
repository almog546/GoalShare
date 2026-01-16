import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home({ user }) {
    const [groups, setGroups] = useState([]);
    const GroupType = {
        COUPLE: 'couple',
        FAMILY: 'family',
        ROOMMATES: 'roommates',
        OTHER: 'other',
    };

    useEffect(() => {
        async function fetchGroups() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Group/user-groups`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );
                if (!res.ok) {
                    console.error('Failed to fetch groups');
                } else {
                    const data = await res.json();
                    setGroups(data);
                }
            } catch (error) {
                console.error('Failed to fetch groups', error);
            }
        }
        fetchGroups();
    }, []);

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
                    <h2 className={styles.subtitle}>Your Groups:</h2>
                    {groups.length === 0 ? (
                        <p>You are not part of any groups yet.</p>
                    ) : (
                        <ul className={styles.groupList}>
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className={styles.groupItem}
                                >
                                    <h3>{group.name}</h3>

                                    <p>Type: {GroupType[group.type]}</p>
                                </div>
                            ))}
                        </ul>
                    )}
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
