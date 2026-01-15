const prisma = require('../prismaClient');
async function createGroup(req, res) {
    const { name, type } = req.body;
    try {
        const newGroup = await prisma.group.create({
            data: {
                name,
                type,
            },
        });
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
    createGroup,
};
