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
                groupId: req.body.groupId,
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
module.exports = {
    createGoal,
};
