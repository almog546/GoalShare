const prisma = require('../prismaClient');
async function getActivityLogsByGroupId(req, res) {
    const groupId = req.params.groupId;
    try {
        const activityLogs = await prisma.activityLog.findMany({
            where: {
                groupId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json(activityLogs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
    getActivityLogsByGroupId,
};
