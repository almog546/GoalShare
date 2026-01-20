import styles from './CreateBill.module.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CreateBill() {
    const [name, setName] = useState('');
    const [amount, setamount] = useState('');
    const [frequency, setfrequency] = useState('MONTHLY');
    const [dueDay, setdueDay] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { groupId } = useParams();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Bill/create/${groupId}/`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        name,
                        amount: Number(amount),
                        frequency,
                        dueDay: Number(dueDay),
                    }),
                },
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Bill creation failed');
                return;
            }

            navigate(`/group/${groupId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form className={styles.container} onSubmit={handleSubmit}>
                <h1>Recurring bills</h1>
                <h3>Track shared monthly expenses</h3>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="amount"
                    value={amount}
                    onChange={(e) => setamount(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="dueDay"
                    value={dueDay}
                    onChange={(e) => setdueDay(e.target.value)}
                    required
                />

                <select
                    value={frequency}
                    onChange={(e) => setfrequency(e.target.value)}
                >
                    <option value="MONTHLY">monthly</option>
                    <option value="QUARTERLY">quarterly</option>
                    <option value="YEARLY">yearly</option>
                </select>

                <button className={styles.createBillButton}>Create Bill</button>
            </form>
        </>
    );
}
