import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './InvitePage.module.css';

export default function InvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [inviteData, setInviteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        async function fetchInviteDetails() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/InviteLink/${token}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Invalid invite');
                }

                const data = await res.json();
                setInviteData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchInviteDetails();
    }, [token]);

    async function handleJoin() {
        setJoining(true);
        setError('');

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/InviteLink/${token}/consume`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to join group');
            }

            navigate(`/group/${inviteData.groupId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setJoining(false);
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error && !inviteData) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.errorTitle}>Invalid Invite</h2>
                    <p className={styles.error}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Group Invitation</h2>
                <div className={styles.details}>
                    <p>You've been invited to join as:</p>
                    <p className={styles.role}>{inviteData.role}</p>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    onClick={handleJoin}
                    disabled={joining}
                    className={styles.joinButton}
                >
                    {joining ? 'Joining...' : 'Join Group'}
                </button>
            </div>
        </div>
    );
}
