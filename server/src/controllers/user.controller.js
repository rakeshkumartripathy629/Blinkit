import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import uploadImageClodinary from '../utils/uploadImageClodinary.js'
import generatedToken from '../utils/generateToken.js'
import generatedOtp from '../utils/generatedOtp.js'

const cookieOptions = {
  httpOnly: true,
  secure: true, // development mein agar HTTPS nahin toh false karo
  sameSite: 'None'
}

function sendError(res, status = 400, message = 'Something went wrong') {
  return res.status(status).json({
    message,
    error: true,
    success: false
  })
}

export async function registerUserController(request, response) {
  try {
    let { name, email, password } = request.body
    if (!name || !email || !password) {
      return sendError(response, 400, 'Provide name, email and password')
    }

    email = email.toLowerCase()
    const existing = await UserModel.findOne({ email })
    if (existing) {
      return sendError(response, 400, 'Email already registered')
    }

    const salt = await bcryptjs.genSalt(10)
    const hashed = await bcryptjs.hash(password, salt)

    const newUser = new UserModel({
      name,
      email,
      password: hashed
    })
    const saved = await newUser.save()

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${saved._id}`
    await sendEmail({
      sendTo: email,
      subject: "Verify email from binkeyit",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl
      })
    })

    const token = generatedToken(saved._id)

    response.cookie('token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days

    const safeUser = {
      _id: saved._id,
      name: saved.name,
      email: saved.email,
      verify_email: saved.verify_email || false,
      createdAt: saved.createdAt
    }

    return response.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: {
        user: safeUser
      }
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}


//refresh token controler
export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body
    if (!code) return sendError(response, 400, "Code required")

    const user = await UserModel.findById(code)
    if (!user) {
      return sendError(response, 400, "Invalid code")
    }

    await UserModel.updateOne({ _id: code }, { verify_email: true })

    return response.json({
      message: "Verify email done",
      success: true,
      error: false
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}

export async function loginController(request, response) {
  try {
    let { email, password } = request.body
    if (!email || !password) {
      return sendError(response, 400, "Provide email and password")
    }

    email = email.toLowerCase()
    const user = await UserModel.findOne({ email })
    if (!user) {
      return sendError(response, 400, "User not registered")
    }

    if (user.status !== "Active") {
      return sendError(response, 400, "Contact to Admin")
    }

    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return sendError(response, 400, "Incorrect password")
    }

    const token = generatedToken(user._id)
    await UserModel.findByIdAndUpdate(user._id, { last_login_date: new Date() })

    response.cookie('token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

    return response.json({
      message: "Login successfully",
      error: false,
      success: true
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}

export async function logoutController(request, response) {
  try {
    const userId = request.userId // middleware se

    response.clearCookie("token", cookieOptions)

    return response.json({
      message: "Logout successfully",
      error: false,
      success: true
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}

export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId
    const image = request.file
    if (!image) return sendError(response, 400, "No image provided")

    const upload = await uploadImageClodinary(image)
    await UserModel.findByIdAndUpdate(userId, { avatar: upload.url })

    return response.json({
      message: "Upload profile",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.url
      }
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}

export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId
    const { name, email, mobile, password } = request.body

    const updateFields = {}
    if (name) updateFields.name = name
    if (email) updateFields.email = email.toLowerCase()
    if (mobile) updateFields.mobile = mobile
    if (password) {
      const salt = await bcryptjs.genSalt(10)
      updateFields.password = await bcryptjs.hash(password, salt)
    }

    const updateUser = await UserModel.updateOne({ _id: userId }, updateFields)

    return response.json({
      message: "Updated successfully",
      error: false,
      success: true,
      data: updateUser
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}

export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body
    if (!email) return sendError(response, 400, "Email required")

    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (!user) return sendError(response, 400, "Email not available")

    const otp = generatedOtp()
    const expireTime = Date.now() + 60 * 60 * 1000

    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString()
    })

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Binkeyit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp
      })
    })

    return response.json({
      message: "Check your email",
      error: false,
      success: true
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}

export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body
    if (!email || !otp) return sendError(response, 400, "Provide required field email, otp.")

    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (!user) return sendError(response, 400, "Email not available")

    const currentTime = new Date().toISOString()
    if (!user.forgot_password_expiry || user.forgot_password_expiry < currentTime) {
      return sendError(response, 400, "Otp is expired")
    }

    if (otp !== user.forgot_password_otp) {
      return sendError(response, 400, "Invalid otp")
    }

    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: "",
      forgot_password_expiry: ""
    })

    return response.json({
      message: "Verify otp successfully",
      error: false,
      success: true
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}



export async function resetpassword(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body
    if (!email || !newPassword || !confirmPassword) {
      return sendError(response, 400, "Provide required fields email, newPassword, confirmPassword")
    }

    if (newPassword !== confirmPassword) {
      return sendError(response, 400, "newPassword and confirmPassword must be same.")
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() })
    if (!user) return sendError(response, 400, "Email is not available")

    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(newPassword, salt)

    await UserModel.findByIdAndUpdate(user._id, {
      password: hashPassword
    })

    return response.json({
      message: "Password updated successfully.",
      error: false,
      success: true
    })
  } catch (error) {
    return sendError(response, 500, error.message || error)
  }
}

export async function userDetails(request, response) {
  try {
    const userId = request.userId
    const user = await UserModel.findById(userId).select('-password -refresh_token')
    return response.json({
      message: 'user details',
      data: user,
      error: false,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      message: "Something is wrong",
      error: true,
      success: false
    })
  }
}
