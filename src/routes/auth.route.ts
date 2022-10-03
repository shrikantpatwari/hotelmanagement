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
import { Types } from 'mongoose'
const router = express.Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.validPassword(password))
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password')
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

router.get('/forgot-password',async (req, res, next) => {
  try {
    const email: string | undefined = req.query?.email?.toString();
    if (email) {
      const user = await User.findOne({ email })
      const hostName = req.headers.origin
      if (user) {
        const token = user.setResetToken();
        MailService.sendMail({
          from: EMAIL_SERVICE_AUTH_USER, // sender address
          to: user.email, // list of receivers
          subject: 'Password reset link',
          template: 'forgot', // the name of the template file i.e email.handlebars
          context:{
              name: user.name,
              email: user.email,
              token: token,
              host: hostName
          }
        });
        res.send({status: 'ok', msg: 'Password reset link sent successfully'});
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No associated account find with given email provided');
      }
    } else {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Missing required parameters'));
    }
  } catch (error) {
    next(error);
  }
})

router.post('/set-password', async (req, res, next) => {
  try {
    const requiredFields = ['email', 'token', 'password'];
    const givenFields = Object.getOwnPropertyNames(req.body)
    if (!requiredFields.every(field => givenFields.includes(field) && req.body[field])) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Missing required parameters'));
    }
    const { email, token, password } = req.body
    const user = await User.findOne({ email, token });
    if (!user)
      throw new ApiError(httpStatus.BAD_REQUEST, 'No associated account find with given email provided or token provided')
    user.setPassword(password);
    await user.save()
    res.json({
      status: 'ok',
      msg: 'Password set successfull'
    });
  } catch (error) {
    next(error);
  }
})

router.post('/reset-password', passport.authenticate('jwt', { session: false }),async (req, res, next) => {
  try {
    const requiredFields = ['currentPassword', 'newPassword'];
    const givenFields = Object.getOwnPropertyNames(req.body)
    if (!requiredFields.every(field => givenFields.includes(field) && req.body[field])) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Missing required parameters'));
    }
    const { currentPassword, newPassword } = req.body;
    const user: any = req.user;
    const dbUser = await User.findOne({_id: Types.ObjectId(user._id)});
    if (!user || !dbUser.validPassword(currentPassword))
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password')
    dbUser.setPassword(newPassword);
    await dbUser.save();
    res.send({status: 'ok', msg: 'Password changed successfully'});
  } catch (e) {
    next(e)
  }
})

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const user: any = req.user;
  const dbUser = await User.findOne({_id: Types.ObjectId(user._id)});
  console.log(dbUser.toUserJSON());
  res.json(dbUser.toUserJSON());
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
      res.send({status: 'ok', bookings: brData});
    }).catch(e => {
      throw new Error("failed to fetch all bookins");
    })
  } catch (e) {
    if (e.name === 'MongoError') return res.status(httpStatus.BAD_REQUEST).send(e)
    next(e)
  }
})

export default router
