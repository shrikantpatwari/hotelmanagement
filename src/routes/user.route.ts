import ApiError from '@/utils/ApiError'
import express from 'express'
import httpStatus from 'http-status'
import passport from 'passport'
import { User } from '@/models/user.model'
import { Types } from 'mongoose'
const router = express.Router()

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const {
        first_name,
        last_name,
        id,
        phone,
        birthday,
        gender,
        address,
        avatar
      } = req.body;
      User.updateOne({_id : Types.ObjectId(id)}, {$set: {
        first_name,
        last_name,
        phone,
        birthday,
        gender,
        address,
        avatar
      }}).then((user) => {
        res.json({status: 'ok', msg: 'Update successfull'});
      }).catch((e) => {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to update record')
      })

  } catch (e) {
    next(e)
  }
})

export default router
