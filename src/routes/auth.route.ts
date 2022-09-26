/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
import ApiError from '@/utils/ApiError'
import express from 'express'
import httpStatus from 'http-status'
import passport from 'passport'
import * as generator from 'generate-password'
import MailService from '@/utils/MailSender'
import { EMAIL_SERVICE_AUTH_USER } from '@/config/config'
import { Booking } from '@/models/booking.model'
import { User } from '@/models/user.model'
import { Room } from '@/models/Room.model'
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
    console.log(password);
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
      from: EMAIL_SERVICE_AUTH_USER, // sender address
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

router.get('/my-bookings', passport.authenticate('jwt', {session: false}),async (req, res, next) => {
  console.log(req.user)
  try {
    const user: any = req.user;
    const bookings = await Booking.find({userId: user._id});
    const barr:any[] = [];
    const brData: any[] = []
    bookings.forEach((bookin: any) => {
      barr.push(
        new Promise((resolve, reject) => {
          Room.findOne({'_id': bookin.roomId}).then((room) => {
            brData.push(Object.assign({}, bookin.toJSON(), {room: room.toJSON()}));
            resolve('ok');
          }).catch((e) => {
            reject(e);
          });
        })
      );
    });

    Promise.all(barr).then(() => {
      res.send({success: 'ok', bookings: brData});
    }).catch(e => {
      throw new Error("failed to fetch all bookins");
    })
  } catch (e) {
    if (e.name === 'MongoError') return res.status(httpStatus.BAD_REQUEST).send(e)
    next(e)
  }
})

export default router
