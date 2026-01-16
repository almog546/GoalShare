import styles from './CreateGroup.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup() {
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState('');
    const [groupType, setGroupType] = useState('COUPLE');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Group/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        name: groupName,
                        type: groupType,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Group creation failed');
                return;
            }

            navigate(`/`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <h1>Create a Group</h1>

            <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
            />

            <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
            >
                <option value="COUPLE">Couple</option>
                <option value="FAMILY">Family</option>
                <option value="ROOMMATES">Roommates</option>
                <option value="OTHER">Other</option>
            </select>

            <button disabled={loading} className={styles.createGroupButton}>
                Create Group
            </button>

            {loading && <p className={styles.loading}>Creating group...</p>}
            {error && <p className={styles.error}>{error}</p>}
        </form>
    );
}
