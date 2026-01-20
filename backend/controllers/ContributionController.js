const prisma = require('../prismaClient');

async function createContribution(req, res) {
    const { amount, date, note } = req.body;
    try {
        const newContribution = await prisma.contribution.create({
            data: {
                amount: Number(amount),
                date: date ? new Date(date) : new Date(),
                note,
                userId: req.session.userId,
                goalId: req.params.goalId,
            },
        });
        await prisma.goal.update({
            where: { id: req.params.goalId },
            data: {
                current: {
                    increment: Number(amount),
                },
            },
        });

        res.status(201).json(newContribution);
    } catch (error) {
        console.error('Error creating Contribution:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createContribution,
};
