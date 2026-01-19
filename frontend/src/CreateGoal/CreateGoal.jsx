import styles from './CreateGoal.module.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CreateGoal() {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [monthlyHint, setMonthlyHint] = useState('');
    const { groupid } = useParams();
    const [goals, setGoals] = useState([]);
    const navigate = useNavigate();

    async function handleCreateGoal(e) {
        e.preventDefault();
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Goal/create/${groupid}`,
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
                        monthlyHint: monthlyHint ? Number(monthlyHint) : null,
                    }),
                },
            );
            if (res.ok) {
                const newGoal = await res.json();
                setGoals((prevGoals) => [...prevGoals, newGoal]);
                navigate(`/group/${groupid}`);
            } else {
                console.error('Failed to create goal');
            }
        } catch (error) {
            console.error('Failed to create goal', error);
        }
    }

    return (
        <>
            <form
                className={styles.container}
                onSubmit={(e) => handleCreateGoal(e)}
            >
                <h2>Create New Goal</h2>
                <label>
                    Goal Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    Target Amount:
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                    />
                </label>
                <label>
                    Deadline:
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                </label>
                <label>
                    Monthly Hint:
                    <input
                        type="text"
                        value={monthlyHint}
                        onChange={(e) => setMonthlyHint(e.target.value)}
                    />
                </label>
                <button type="submit">Create Goal</button>
            </form>
        </>
    );
}
