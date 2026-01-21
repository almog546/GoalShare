const prisma = require('../prismaClient');
const { GroupRole } = require('@prisma/client');

async function createGroup(req, res) {
    const { name, type } = req.body;
    try {
        const newGroup = await prisma.group.create({
            data: {
                name,
                type,
                members: {
                    create: {
                        userId: req.session.userId,
                        role: GroupRole.OWNER,
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
                type: 'GROUP_CREATED',
                groupId: newGroup.id,
                message: `Group ${name} created by ${username.name}.`,
            },
        });
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getGroups(req, res) {
    try {
        const groups = await prisma.group.findMany({
            where: {
                members: {
                    some: {
                        userId: req.session.userId,
                    },
                },
            },
        });
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getGroupById(req, res) {
    const { id } = req.params;
    try {
        const group = await prisma.group.findFirst({
            where: {
                id,
                members: {
                    some: {
                        userId: req.session.userId,
                    },
                },
            },
        });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createGroup,
    getGroups,
    getGroupById,
};
