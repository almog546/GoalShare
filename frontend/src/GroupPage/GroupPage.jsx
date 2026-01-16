import { useEffect, useState } from 'react';
import styles from './GroupPage.module.css';
import { useParams } from 'react-router-dom';

export default function GroupPage() {
    const [groupdetails, setGroupDetails] = useState(null);
    const [goals, setGoals] = useState([]);
    const [bills, setBills] = useState([]);
    const [name, setName] = useState('');
    const [target, setTarget] = useState(0);
    const [deadline, setDeadline] = useState('');
    const [monthlyHint, setMonthlyHint] = useState('');
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
    async function handleCreateGoal(e) {
        e.preventDefault();
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Goal/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        name,
                        target: Number(target),
                        deadline,
                        monthlyHint,
                        groupId: id,
                    }),
                }
            );
            if (res.ok) {
                const newGoal = await res.json();
                setGoals((prevGoals) => [...prevGoals, newGoal]);
            } else {
                console.error('Failed to create goal');
            }
        } catch (error) {
            console.error('Failed to create goal', error);
        }
    }

    return (
        <>
            {goals.length === 0 && bills.length === 0 ? (
                <div className={styles.container}>
                    <h2>No goals or bills found for this group.</h2>
                    <button className={styles.createGoalButton}>
                        Create Goal
                    </button>
                    <button className={styles.createBillButton}>
                        Create Bill
                    </button>
                </div>
            ) : (
                <h1>good</h1>
            )}{' '}
        </>
    );
}
