import styles from './AddContribution.module.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function AddContribution() {
    const [amount, setamount] = useState('');
    const [date, setdate] = useState('');
    const [note, setnote] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { groupId } = useParams();
    const { goalId } = useParams();

    async function handleCreateContribution(e) {
        e.preventDefault();
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Contribution/create/${groupId}/goal/${goalId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        amount,
                        date,
                        note,
                    }),
                },
            );
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Group creation failed');
                return;
            }
            navigate(`/group/${groupId}/goal/${goalId}`);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <form
                className={styles.container}
                onSubmit={handleCreateContribution}
            >
                <h1>Create a Group</h1>

                <input
                    type="number"
                    placeholder="amount"
                    value={amount}
                    onChange={(e) => setamount(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="note"
                    value={note}
                    onChange={(e) => setnote(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="date"
                    value={date}
                    onChange={(e) => setdate(e.target.value)}
                    required
                />
                <button className={styles.contributionGroupButton}>
                    Add contribution
                </button>
            </form>
        </>
    );
}
