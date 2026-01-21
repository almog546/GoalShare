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
                current: 0,
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
        const username = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { name: true },
        });
        await prisma.activityLog.create({
            data: {
                type: 'GOAL_CREATED',
                groupId: req.params.groupId,
                message: `Goal ${name} created by ${username.name}.`,
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
async function getGoalById(req, res) {
    const userId = req.session.userId;
    const { goalId } = req.params;

    try {
        const goal = await prisma.goal.findFirst({
            where: {
                id: goalId,
                group: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        res.status(200).json(goal);
    } catch (error) {
        console.error('Error fetching goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function deleteGoal(req, res) {
    const { goalId } = req.params;
    const userId = req.session.userId;
    try {
        const goal = await prisma.goal.findFirst({
            where: {
                id: goalId,
                group: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        await prisma.goal.delete({
            where: { id: goalId },
        });
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createGoal,
    getGoalsByGroupId,
    getGoalById,
    deleteGoal,
};
