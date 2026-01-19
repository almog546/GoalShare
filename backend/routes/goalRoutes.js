const express = require('express');
const router = express.Router();
const {
    createGoal,
    getGoalsByGroupId,
    getGoalById,
    deleteGoal,
} = require('../controllers/goalController');
const requireAuth = require('../middlewares/requireAuth');
const {
    requireGroupMember,
    requireRole,
} = require('../middlewares/requireAuthInGroupe');

router.post(
    '/create/:groupId',
    requireAuth,
    requireGroupMember,
    requireRole,
    createGoal,
);
router.get(
    '/group/:groupId',
    requireAuth,
    requireGroupMember,
    getGoalsByGroupId,
);
router.get(
    '/group/:groupId/goal/:goalId',
    requireAuth,
    requireGroupMember,
    getGoalById,
);
router.delete(
    '/group/:groupId/goal/:goalId',
    requireAuth,
    requireGroupMember,
    requireRole,
    deleteGoal,
);

module.exports = router;
