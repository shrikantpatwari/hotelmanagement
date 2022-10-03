import ApiError from '@/utils/ApiError'
import express from 'express'
import httpStatus from 'http-status'
import passport from 'passport'
import { User } from '@/models/user.model'
import { Types } from 'mongoose'
const router = express.Router()

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const updateObj:any = {};
    const { firstname, lastname, phone, birthday, gender, address, avatar } = req.body;
    if(firstname){
      updateObj["first_name"] = firstname;
    }
    if(address){
      updateObj["address"] = address;
    }
    if(lastname){
      updateObj["last_name"] = lastname;
    }
    if(phone){
      updateObj["phone"] = phone;
    }
    if(birthday){
      updateObj["birthday"] = birthday;
    }
    if("gender"){
      updateObj["gender"]= gender;
    }
    if("avatar"){
      updateObj["avatar"] = avatar; 
    }
  const user: any = req.user;
    User.updateOne(
      { _id: Types.ObjectId(user._id) },
      {
        $set: updateObj,
      },
    )
      .then((user) => {
        res.json({ status: 'ok', msg: 'Update successfull', data: user })
      })
      .catch((e) => {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to update record')
      })
  } catch (e) {
    next(e)
  }
})

export default router
