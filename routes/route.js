const { Router } = require('express')
const router = Router()
const authControllers = require('../controllers/authControllers.js')
const { signup_get_delete } = require('../controllers/authControllers.js')
const { signup_get_update } = require('../controllers/authControllers.js')
const { users_get } = require('../controllers/authControllers.js')

router.post('/login', authControllers.login_post);
router.get('/users', users_get)
router.delete('/signup/:id', signup_get_delete)
router.put('/signup/:id', signup_get_update)
router.get('/signup', authControllers.signup_get)
router.get('/login', authControllers.login_get)
router.post('/signup', authControllers.signup_post)


module.exports = router;