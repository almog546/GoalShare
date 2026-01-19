import { use } from 'react';
import styles from './GoalPage.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProgressBar from '../ProgressBar/ProgressBar.jsx';
import { useNavigate } from 'react-router-dom';

export default function GoalPage() {
    const { groupId } = useParams();
    const { goalId } = useParams();
    const [goals, setGoals] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGoalDetails() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Goal/group/${groupId}/goal/${goalId}`,
                    { method: 'GET', credentials: 'include' },
                );
                if (!res.ok) {
                    console.error('Failed to fetch goal details');
                } else {
                    const data = await res.json();
                    setGoals(data);
                }
            } catch (error) {
                console.error('Failed to fetch goal details', error);
            }
        }
        fetchGoalDetails();
    }, [groupId, goalId]);
    async function handledelete() {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Goal/group/${groupId}/goal/${goalId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );
            const data = await res.json();
            if (!res.ok) {
                console.error(data.message);
                return;
            }
            setGoals(null);
            navigate(`/group/${groupId}`);
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    }
    return (
        <>
            <div className={styles.container}>
                <h1> {goals.name}</h1>
                <ProgressBar current={goals.current} target={goals.target} />

                <p>
                    {' '}
                    Deadline:{' '}
                    {new Date(goals.deadline).toLocaleDateString()}{' '}
                </p>
                <p> Suggested Hint: ${goals.monthlyHint} </p>
                <div className={styles.buttonsWrapper}>
                    <button className={styles.addContributionButton}>
                        Add contribution
                    </button>

                    <button
                        className={styles.deleteGoalButton}
                        onClick={() => handledelete(goalId.id)}
                    >
                        delete goal
                    </button>
                </div>
            </div>
        </>
    );
}
