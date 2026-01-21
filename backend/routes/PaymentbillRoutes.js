const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/requireAuth');
const { requireGroupMember } = require('../middlewares/requireAuthInGroupe');

const {
    getBillPaymentsByBillId,
} = require('../controllers/PaymentbillRoutesController');

router.get(
    '/group/:groupId/bill/:billId',
    requireAuth,
    requireGroupMember,
    getBillPaymentsByBillId,
);

module.exports = router;
