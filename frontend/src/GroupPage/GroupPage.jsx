import { useEffect, useState } from 'react';
import styles from './GroupPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function GroupPage() {
    const navigate = useNavigate();
    const [groupdetails, setGroupDetails] = useState(null);
    const [goals, setGoals] = useState([]);
    const [bills, setbills] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);

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

    function showGoals() {
        setActiveTab('goals');
    }

    function showBills() {
        setActiveTab('bills');
    }
    function showActivityLog() {
        setActiveTab('ActivityLog');
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
            </div>
        </>
    );
}
