/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

import logger from '@/config/logger'
import { Room } from '@/models/room.model'
import { User } from '@/models/user.model'
import ApiError from '@/utils/ApiError'
import express from 'express'
import httpStatus from 'http-status'
import passport from 'passport'
import * as generator from 'generate-password'
import MailService from '@/utils/MailSender'

const router = express.Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.validPassword(password))
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid email or password')
    res.json(user.toAuthJSON())
  } catch (e) {
    next(e)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      birthday,
      gender,
      address
    } = req.body
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    const user = new User()
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.phone = phone
    user.birthday = birthday
    user.gender = gender
    user.address = address
    user.setPassword(password)
    await user.save()
    MailService.sendMail({
      from: '"Shrikant" <shrikant.patwari@sadhanaitsolutions.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Welcome!',
      template: 'welcome', // the name of the template file i.e email.handlebars
      context:{
          name: user.name,
          password: password
      }
    })
    res.json(user.toAuthJSON())
  } catch (e) {
    if (e.name === 'MongoError') return res.status(httpStatus.BAD_REQUEST).send(e)
    next(e)
  }
})

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  res.send(req.user)
})

export default router
