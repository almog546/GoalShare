const prisma = require('../prismaClient');

async function createBill(req, res) {
    const { name, amount, frequency, dueDay } = req.body;
    const { groupId } = req.params;
    try {
        const newBill = await prisma.recurringBill.create({
            data: {
                name,
                amount,
                frequency,
                dueDay,
                groupId: groupId,
            },
        });
        const username = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { name: true },
        });
        await prisma.activityLog.create({
            data: {
                type: 'BILL_ADDED',
                groupId: groupId,
                message: `Bill of ${amount} added with name ${name} by ${username.name}.`,
            },
        });
        res.status(201).json(newBill);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getBillsByGroupId(req, res) {
    const groupId = req.params.groupId;
    try {
        const bills = await prisma.recurringBill.findMany({
            where: {
                groupId,
            },
        });
        res.status(200).json(bills);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getbillById(req, res) {
    const userId = req.session.userId;
    const { billId } = req.params;
    try {
        const bill = await prisma.recurringBill.findFirst({
            where: {
                id: billId,
                group: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        });

        if (!bill) {
            return res.status(404).json({ message: 'bill not found' });
        }

        res.status(200).json(bill);
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function createPayment(req, res) {
    const { amount, date } = req.body;
    const { billId, groupId } = req.params;

    const parsedAmount = Number(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
            message: 'Amount must be a positive number',
        });
    }

    try {
        const bill = await prisma.recurringBill.findUnique({
            where: { id: billId },
            select: {
                amount: true,
                frequency: true,
            },
        });

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        const paidAgg = await prisma.billPayment.aggregate({
            where: { billId },
            _sum: { amount: true },
        });

        const totalPaid = paidAgg._sum.amount || 0;

        if (totalPaid >= bill.amount) {
            return res.status(400).json({
                message: 'Bill already fully paid',
            });
        }

        if (totalPaid + parsedAmount > bill.amount) {
            return res.status(400).json({
                message: 'Payment exceeds bill amount',
            });
        }

        const newPayment = await prisma.billPayment.create({
            data: {
                amount: parsedAmount,
                date: date ? new Date(date) : new Date(),
                userId: req.session.userId,
                billId,
            },
        });

        if (totalPaid + parsedAmount === bill.amount) {
            const nextDate = new Date();

            switch (bill.frequency) {
                case 'MONTHLY':
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    break;

                case 'QUARTERLY':
                    nextDate.setMonth(nextDate.getMonth() + 6);
                    break;

                case 'YEARLY':
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                    break;
            }

            await prisma.recurringBill.update({
                where: { id: billId },
                data: {
                    dueDay: nextDate,
                },
            });
        }
        const billname = await prisma.recurringBill.findUnique({
            where: { id: billId },
            select: { name: true },
        });
        const username = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { name: true },
        });
        await prisma.activityLog.create({
            data: {
                type: 'BILL_PAID',
                groupId: groupId,
                message: `Payment of ${parsedAmount} made for bill ${billname.name} by ${username.name}.`,
            },
        });

        res.status(201).json(newPayment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createBill,
    getBillsByGroupId,
    getbillById,
    createPayment,
};
