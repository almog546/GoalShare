const prisma = require('../prismaClient');

async function getBillPaymentsByBillId(req, res) {
    const { billId } = req.params;

    try {
        const billPayments = await prisma.billPayment.findMany({
            where: {
                billId: billId,
            },
        });

        res.status(200).json(billPayments);
    } catch (error) {
        console.error('Error fetching bill payments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getBillPaymentsByBillId,
};
