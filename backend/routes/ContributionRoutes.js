const express = require('express');
const router = express.Router();

const { createContribution } = require('../controllers/ContributionController');
const requireAuth = require('../middlewares/requireAuth');
const {
    requireGroupMember,
    requireRole,
} = require('../middlewares/requireAuthInGroupe');

router.post(
    '/create/:groupId/goal/:goalId',
    requireAuth,
    requireGroupMember,
    requireRole,
    createContribution,
);

module.exports = router;
