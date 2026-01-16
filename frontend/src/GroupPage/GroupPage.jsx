import { useEffect, useState } from 'react';
import styles from './GroupPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function GroupPage({ goals, bills }) {
    const navigate = useNavigate();
    const [groupdetails, setGroupDetails] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        async function fetchGroupDetails() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Group/${id}`,
                    { method: 'GET', credentials: 'include' }
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
    }, [id]);

    return (
        <>
            {goals.length === 0 && bills.length === 0 ? (
                <div className={styles.container}>
                    <h2>No goals or bills found for this group.</h2>
                    <button
                        className={styles.createGoalButton}
                        onClick={() => navigate('/create-goal')}
                    >
                        Create Goal
                    </button>
                    <button className={styles.createBillButton}>
                        Create Bill
                    </button>
                </div>
            ) : (
                <h1 className={styles.good}>good</h1>
            )}{' '}
        </>
    );
}
