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

module.exports = {
    createGroup,
    getGroups,
};
