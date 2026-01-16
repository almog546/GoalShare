const express = require('express');
const router = express.Router();
const {
    createGoal,
    getGoalsByGroupId,
} = require('../controllers/goalController');
const requireAuth = require('../middlewares/requireAuth');
const {
    requireGroupMember,
    requireRole,
} = require('../middlewares/requireGroupMember');

router.post(
    '/create',
    requireAuth,
    requireGroupMember,
    requireRole,
    createGoal
);

module.exports = router;
