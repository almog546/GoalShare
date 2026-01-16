import styles from './CreateGroup.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup() {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [grouptype, setGroupType] = useState('COUPLE');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Group/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ name: groupName, type: grouptype }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                navigate('/group-dashboard');
            } else {
                setError(data.message || 'Group creation failed');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form className={styles.container}>
                <h1>Create a Group</h1>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <select
                    value={grouptype}
                    onChange={(e) => setGroupType(e.target.value)}
                >
                    <option value="COUPLE">Couple</option>
                    <option value="FAMILY">Family</option>
                    <option value="ROOMMATES">Roommates</option>
                    <option value="OTHER">Other</option>
                </select>
                <button
                    onClick={handleSubmit}
                    className={styles.createGroupButton}
                >
                    Create Group
                </button>
                {loading && <p className={styles.loading}>Creating group...</p>}
                {error && <p className={styles.error}>{error}</p>}
                <p className={styles.allAmounts}>
                    All amounts are displayed in USD ($)
                </p>
            </form>
        </>
    );
}
