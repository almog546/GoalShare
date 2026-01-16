async function requireGroupMember(req, res, next) {
    const userId = req.session.userId;
    const groupId = req.body.groupId || req.params.groupId;

    if (!userId || !groupId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const membership = await prisma.groupMember.findFirst({
        where: {
            userId,
            groupId,
        },
    });

    if (!membership) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
}

async function requireRole(req, res, next) {
    const userId = req.session.userId;
    const groupId = req.body.groupId || req.params.groupId;

    const membership = await prisma.groupMember.findFirst({
        where: {
            userId,
            groupId,
        },
    });

    if (!membership) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (membership.role !== 'OWNER' && membership.role !== 'CONTRIBUTOR') {
        return res
            .status(403)
            .json({ message: 'OWNER or contributor role required' });
    }

    next();
}

module.exports = { requireGroupMember, requireRole };
