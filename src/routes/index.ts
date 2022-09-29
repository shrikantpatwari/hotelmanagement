import express from 'express'

import booking from './booking.route'
import rooms from './rooms.route'
import auth from './auth.route'
import user from './user.route'

const router = express.Router()

router.use('/booking', booking)
router.use('/rooms', rooms)
router.use('/user', user)
router.use(auth)

export default router
