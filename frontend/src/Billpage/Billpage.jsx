import styles from './Billpage.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Billpage({ showTemporaryText }) {
    const [amount, setamount] = useState('');
    const [date, setdate] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { groupId } = useParams();
    const { billId } = useParams();
    const [bills, setbills] = useState({});
    const [billspaid, setbillspaid] = useState([]);

    useEffect(() => {
        async function fetchBill() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Bill/group/${groupId}/bill/${billId}`,
                    { credentials: 'include' },
                );

                if (!res.ok) throw new Error('Failed to fetch bill');

                const data = await res.json();
                setbills(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchBill();
    }, [groupId, billId]);
    useEffect(() => {
        async function fetchBill() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/Paymentbill/group/${groupId}/bill/${billId}`,
                    { credentials: 'include' },
                );

                if (!res.ok) throw new Error('Failed to fetch bill');

                const data = await res.json();
                setbillspaid(data);
                
            } catch (err) {
                console.error(err);
            }
        }

        fetchBill();
    }, [groupId, billId]);

    async function handleCreateBillPayment(e) {
        e.preventDefault();
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Bill/create/${groupId}/bill/${billId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        amount,
                        date,
                    }),
                },
            );
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Group creation failed');
                return;
            }
            navigate(`/group/${groupId}`);
            showTemporaryText('Payment added successfully!');
        } catch (err) {
            setError(err.message);
        }
    }
    const totalPaid = billspaid.reduce(
        (sum, payment) => sum + payment.amount,
        0,
    );

    const remaining = bills.amount - totalPaid;
    return (
        <>
            <form
                className={styles.container}
                onSubmit={handleCreateBillPayment}
            >
                <h1>Payment</h1>

                <h2>
                    Left to pay: $
                    {bills.amount -
                        billspaid.reduce(
                            (sum, payment) => sum + payment.amount,
                            0,
                        )}
                </h2>

                <input
                    type="number"
                    placeholder="amount"
                    value={amount}
                    onChange={(e) => setamount(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="date"
                    value={date}
                    onChange={(e) => setdate(e.target.value)}
                    required
                />
                <button
                    className={styles.contributionGroupButton}
                    disabled={remaining <= 0}
                >
                    {remaining <= 0 ? (
                        <span className={styles.paidButton}>Paid</span>
                    ) : (
                        'Add Payment'
                    )}
                </button>
            </form>
        </>
    );
}
