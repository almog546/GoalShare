const express = require('express');
const router = express.Router();

const {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
} = require('../controllers/groupController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/create', requireAuth, createGroup);
router.get('/user-groups', requireAuth, getGroups);
router.get('/:groupid', requireAuth, getGroupById);

module.exports = router;
