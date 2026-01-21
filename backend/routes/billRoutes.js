const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/requireAuth');
const {
    requireGroupMember,
    requireRole,
} = require('../middlewares/requireAuthInGroupe');
const {
    createBill,
    getBillsByGroupId,
    getbillById,
    createPayment,
} = require('../controllers/BillController');

router.post(
    '/create/:groupId',
    requireAuth,
    requireGroupMember,
    requireRole,
    createBill,
);
router.get(
    '/group/:groupId',
    requireAuth,
    requireGroupMember,
    getBillsByGroupId,
);
router.get(
    '/group/:groupId/bill/:billId',
    requireAuth,
    requireGroupMember,
    getbillById,
);
router.post(
    '/create/:groupId/bill/:billId',
    requireAuth,
    requireGroupMember,
    requireRole,
    createPayment,
);
module.exports = router;
