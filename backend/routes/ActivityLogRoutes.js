const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const { requireGroupMember } = require('../middlewares/requireAuthInGroupe');
const {
    getActivityLogsByGroupId,
} = require('../controllers/ActivityLogController');
router.get(
    '/group/:groupId',
    requireAuth,
    requireGroupMember,
    getActivityLogsByGroupId,
);
module.exports = router;
