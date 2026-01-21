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
module.exports = router;
