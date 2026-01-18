const prisma = require('../prismaClient');

async function createGoal(req, res) {
    const { name, target, deadline, monthlyHint } = req.body;
    try {
        const newGoal = await prisma.goal.create({
            data: {
                name,
                target,
                deadline: new Date(deadline),
                monthlyHint,
                groupId: req.params.groupId,
                contributions: {
                    create: {
                        userId: req.session.userId,
                        amount: 0,
                        date: new Date(),
                        note: 'Initial contribution',
                    },
                },
            },
        });
        res.status(201).json(newGoal);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getGoalsByGroupId(req, res) {
    const groupId = req.params.groupId;
    try {
        const goals = await prisma.goal.findMany({
            where: {
                groupId,
            },
        });
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createGoal,
    getGoalsByGroupId,
};
