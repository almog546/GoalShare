const prisma = require('../prismaClient');

async function createBill(req, res) {
    const { name, amount, frequency, dueDay } = req.body;
    try {
        const newBill = await prisma.recurringBill.create({
            data: {
                name,
                amount,
                frequency,
                dueDay,
                groupId: req.params.groupId,
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

module.exports = {
    createBill,
    getBillsByGroupId,
};
