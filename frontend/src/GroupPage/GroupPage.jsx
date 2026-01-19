import { useEffect, useState } from 'react';
import styles from './GroupPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function GroupPage({}) {
    const navigate = useNavigate();
    const [groupdetails, setGroupDetails] = useState(null);
    const [goals, setGoals] = useState([]);

    const { groupid } = useParams();

    useEffect(() => {
        async function fetchGroupDetails() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Group/${groupid}`,
                    { method: 'GET', credentials: 'include' },
                );
                if (!res.ok) {
                    console.error('Failed to fetch group details');
                } else {
                    const data = await res.json();
                    setGroupDetails(data);
                }
            } catch (error) {
                console.error('Failed to fetch group details', error);
            }
        }
        fetchGroupDetails();
    }, [groupid]);
    useEffect(() => {
        async function fetchGoals() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Goal/group/${groupid}`,
                    { method: 'GET', credentials: 'include' },
                );
                if (!res.ok) {
                    console.error('Failed to fetch goals');
                } else {
                    const data = await res.json();
                    setGoals(data);
                }
            } catch (error) {
                console.error('Failed to fetch goals', error);
            }
        }
        fetchGoals();
    }, [groupid]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.buttonsWrapper}>
                    <button
                        className={styles.createGoalButton}
                        onClick={() =>
                            navigate(`/group/${groupid}/create-goal`)
                        }
                    >
                        Create Goal
                    </button>
                    <button className={styles.createBillButton}>
                        Create Bill
                    </button>
                </div>
                {goals.length === 0 && (
                    <p className={styles.noGoalsText}>No goals created yet.</p>
                )}

                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className={styles.goalCard}
                        onClick={() =>
                            navigate(`/group/${groupid}/goal/${goal.id}`)
                        }
                    >
                        <h3 className={styles.goalName}>{goal.name}</h3>
                        <p className={styles.goalTarget}>
                            Target: ${goal.target}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}
