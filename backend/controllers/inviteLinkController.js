const prisma = require('../prismaClient');
const crypto = require('crypto');

async function createInviteLink(req, res) {
    const { groupId } = req.params;
    const { role } = req.body;
    const userId = req.session.userId;

    try {
         const isMember = await prisma.groupMember.findFirst({
        where: { groupId, userId },
    });

    if (!isMember) {
        return res.status(403).json({ message: 'Not allowed' });
    }
        const token = crypto.randomBytes(32).toString('hex');

        const invite = await prisma.inviteLink.create({
            data: {
                token,
                groupId,
                role,
                isActive: true,
            },
        });

        return res.status(201).json({
            inviteUrl: `/invite/${token}`,
        });
    } catch (error) {
        console.error('Error creating invite link:', error);
        return res.status(500).json({ message: 'Failed to create invite link' });
    }
}

async function getInviteLink(req, res) {
    const { token } = req.params;

    try {
        const invite = await prisma.inviteLink.findUnique({
            where: { token },
        });

        if (!invite || !invite.isActive) {
            return res.status(404).json({ message: 'Invite invalid' });
        }

        return res.json({
            groupId: invite.groupId,
            role: invite.role,
        });
    } catch (error) {
        console.error('Error fetching invite link:', error);
        return res.status(500).json({ message: 'Failed to fetch invite link' });
    }
}

async function acceptInvite(req, res) {
    const { token } = req.params;
    const userId = req.session.userId;

    try {
        const invite = await prisma.inviteLink.findUnique({
            where: { token },
        });

        if (!invite || !invite.isActive) {
            return res.status(400).json({ message: 'Invite expired' });
        }

        const existingMember = await prisma.groupMember.findFirst({
            where: {
                groupId: invite.groupId,
                userId,
            },
        });

        if (existingMember) {
            return res
                .status(400)
                .json({ message: 'Already a member of the group' });
        }

        await prisma.groupMember.create({
            data: {
                userId,
                groupId: invite.groupId,
                role: invite.role,
            },
        });

        await prisma.inviteLink.update({
            where: { token },
            data: { isActive: false },
        });
         const username = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { name: true },
        });
        await prisma.activityLog.create({
            data: {
                type: 'MEMBER_JOINED',
                groupId: invite.groupId,
                message: ` ${username.name} joined the group.`,
            },
        });

        return res.json({ message: 'Joined successfully' });
    } catch (error) {
        console.error('Error accepting invite:', error);
        return res.status(500).json({ message: 'Failed to accept invite' });
    }
}

module.exports = {
    createInviteLink,
    getInviteLink,
    acceptInvite,
};
