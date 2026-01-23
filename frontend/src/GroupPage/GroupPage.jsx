import { useEffect, useState } from 'react';
import styles from './GroupPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';

export default function GroupPage({ showTemporaryText }) {
    const navigate = useNavigate();
    const [groupdetails, setGroupDetails] = useState(null);
    const [goals, setGoals] = useState([]);
    const [bills, setbills] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [inviteLink, setInviteLink] = useState('');
    const [loadingInvite, setLoadingInvite] = useState(false);
    const [inviteDetails, setInviteDetails] = useState(null);
    const [joingroup, setJoingroup] = useState(null);
    

    const {token} = useParams();

    const [activeTab, setActiveTab] = useState('goals');
    const { groupid } = useParams();
    const BillFrequency = {
        MONTHLY: 'Monthly ',
        QUARTERLY: 'Quarterly',
        YEARLY: 'Yearly',
    };
    useEffect(() => {
        async function fetchActivityLogs() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/ActivityLog/group/${groupid}`,
                    { method: 'GET', credentials: 'include' },
                );
                if (!res.ok) {
                    console.error('Failed to fetch activity logs');
                } else {
                    const data = await res.json();
                    setActivityLogs(data);
                }
            } catch (error) {
                console.error('Failed to fetch activity logs', error);
            }
        }
        fetchActivityLogs();
    }, [groupid]);

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
    useEffect(() => {
        async function fetchBills() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Bill/group/${groupid}`,
                    { method: 'GET', credentials: 'include' },
                );
                if (!res.ok) {
                    console.error('Failed to fetch goals');
                } else {
                    const data = await res.json();
                    setbills(data);
                }
            } catch (error) {
                console.error('Failed to fetch goals', error);
            }
        }
        fetchBills();
    }, [groupid]);
    useEffect(() => {
        async function fetchInviteLink() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/InviteLink/${token}`,
                    { method: 'GET', credentials: 'include' },
                );
                if (!res.ok) {
                    console.error('Failed to fetch invite link details');
                } else {
                    const data = await res.json();
                    setInviteDetails(data);
                }
            } catch (error) {
                console.error('Failed to fetch invite link details', error);
            }
        }
        fetchInviteLink();
    }, [token]);
    async function jointhegroup(){
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/InviteLink/${token}/consume`,
                { method: 'POST', credentials: 'include' },
            );
            if (!res.ok) {
                console.error('Failed to join group');
            } else {
                const data = await res.json();
                navigate(`/group/${groupId}`);
            }
        } catch (error) {
            console.error('Failed to join group', error);
        }
    }

    async function createInviteLink() {
        setLoadingInvite(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/InviteLink/${groupid}/create`,
                { 
                    method: 'POST', 
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: 'CONTRIBUTOR' })
                },
            );
            if (!res.ok) {
                console.error('Failed to create invite link');
            } else {
                const data = await res.json();
                const fullUrl = `${window.location.origin}${data.inviteUrl}`;
                setInviteLink(fullUrl);
                showTemporaryText('Invite link created successfully!');
            }
        } catch (error) {
            console.error('Failed to create invite link', error);
        } finally {
            setLoadingInvite(false);
        }
    }

    function copyInviteLink() {   
        showTemporaryText('Invite link copied!');
    }

    function showGoals() {
        setActiveTab('goals');
    }

    function showBills() {
        setActiveTab('bills');
    }
    function showActivityLog() {
        setActiveTab('ActivityLog');
    }
    function InviteMembers() {
        setActiveTab('Invite Members');
    }
    

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
                    <button
                        className={styles.createBillButton}
                        onClick={() => navigate(`/group/${groupid}/CreateBill`)}
                    >
                        Create Bill
                    </button>
                </div>
                <div className={styles.goalsbills}>
                    <span onClick={showGoals}>Goals</span>
                    <span onClick={showBills}>Bills</span>
                    <span onClick={showActivityLog}>Activity Log</span>
                    <span onClick={InviteMembers}>Invite Members</span>
                </div>
                {activeTab === 'goals' && (
                    <>
                        {goals.length === 0 && (
                            <p className={styles.noGoalsText}>
                                No goals created yet.
                            </p>
                        )}

                        {goals.map((goal) => (
                            <div
                                key={goal.id}
                                className={styles.goalCard}
                                onClick={() =>
                                    navigate(
                                        `/group/${groupid}/goal/${goal.id}`,
                                    )
                                }
                            >
                                <h3>{goal.name}</h3>
                                <p>Target: ${goal.target}</p>
                            </div>
                        ))}
                    </>
                )}
                {activeTab === 'bills' && (
                    <>
                        {bills.length === 0 && (
                            <p className={styles.noGoalsText}>
                                No bills created yet.
                            </p>
                        )}

                        {bills.map((bill) => (
                            <div key={bill.id} className={styles.billCard}>
                                <h3>{bill.name}</h3>
                                <p className={styles.money}>${bill.amount}</p>
                                <p className={styles.billtext}>
                                    Frequency: {BillFrequency[bill.frequency]}
                                </p>
                                <p className={styles.billtext}>
                                    Due day: {bill.dueDay}
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/group/${groupid}/bill/${bill.id}`,
                                        )
                                    }
                                    className={styles.payBillButton}
                                >
                                    View / Pay Bill
                                </button>
                            </div>
                        ))}
                    </>
                )}
                {activeTab === 'ActivityLog' && (
                    <>
                        {activityLogs.length === 0 && (
                            <p className={styles.noGoalsText}>
                                No activity logs available.
                            </p>
                        )}
                        {activityLogs.map((log) => (
                            <div
                                key={log.id}
                                className={styles.activityLogCard}
                            >
                                <p className={styles.activityLogText}>
                                    {log.message}
                                </p>
                                <p className={styles.activityLogTimestamp}>
                                    {new Date(log.createdAt).toDateString()}
                                </p>
                            </div>
                        ))}
                    </>
                )}
                {activeTab === 'Invite Members' && (
                    <div className={styles.inviteSection}>
                        <h3>Invite Members to Group</h3>
                        <button 
                            onClick={createInviteLink} 
                            disabled={loadingInvite}
                            className={styles.generateButton}
                        >
                            {loadingInvite ? 'Generating...' : 'Generate Invite Link'}
                        </button>
                        
                        {inviteLink && (
                            <div className={styles.linkContainer}>
                                <input 
                                    type="text" 
                                    value={inviteLink} 
                                    readOnly 
                                    className={styles.linkInput}
                                />
                                <button 
                                    onClick={copyInviteLink}
                                    className={styles.copyButton}
                                >
                                    Copy Link
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {inviteDetails && (
                    <div className={styles.inviteDetails}>
                        <h3>Invite Link Details</h3>
                        <p>Group ID: {inviteDetails.groupId}</p>
                        <p>Role: {inviteDetails.role}</p>
                        <button onClick={jointhegroup} className={styles.joinButton}>
                            Join Group
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
