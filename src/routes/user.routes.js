const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router()

router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)
router.post('/', userController.addUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router;