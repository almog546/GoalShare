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
async function deleteGroup(req, res) {
    const { groupid } = req.params;
    try {
        const group = await prisma.group.findFirst({
            where: {
                id: groupid,
                members: {
                    some: {
                        userId: req.session.userId,
                        role: GroupRole.OWNER,
                    },
                },
            },
        });
        if (!group) {
            return res.status(404).json({ message: 'Group not found or unauthorized' });
        }
        await prisma.activityLog.deleteMany({
  where: {groupId: groupid }
});

        await prisma.groupMember.deleteMany({
  where: { groupId: groupid }
});
        await prisma.group.delete({
            where: { id: groupid },
        });
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    deleteGroup,
};
