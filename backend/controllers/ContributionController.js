const prisma = require('../prismaClient');

async function createContribution(req, res) {
    const { amount, date, note } = req.body;
    const { groupId } = req.params;

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
        const goal = await prisma.goal.findUnique({
            where: { id: req.params.goalId },
            select: { name: true },
        });
        const username = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { name: true },
        });
        await prisma.activityLog.create({
            data: {
                type: 'CONTRIBUTION_ADDED',
                groupId: groupId,
                message: `Contribution of ${amount} added to goal ${goal.name} by ${username.name}.`,
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
