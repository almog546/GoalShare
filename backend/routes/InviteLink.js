const express = require('express');
const router = express.Router();
const {
    createInviteLink,
    getInviteLink,
    acceptInvite,
} = require('../controllers/inviteLinkController');
const requireAuth = require('../middlewares/requireAuth');


router.post('/:groupId/create', requireAuth, createInviteLink);
router.get('/:token', requireAuth, getInviteLink);
router.post('/:token/consume', requireAuth, acceptInvite);


module.exports = router;

