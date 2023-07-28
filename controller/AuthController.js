require('dotenv').config();
const UserModel = require("../models/UserModel")
const passwordHelper = require("./../helper/passwordHelper")
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')

module.exports.login = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({
            where: {
                username: req.body.username,
                status: true
            },
            attributes: ["id", "username", "email", "password"]
        })

        const resInvalidUser = {
            status: false,
            result: [],
            message: "The Username you entered is not assigned to a registered user.<br>Please Check and try again."
        }

        if (!user) {
            return res.status(401).json(resInvalidUser)
        }

        const passwordCheck = await passwordHelper.comparePassword(req.body.password, user.password)
        if (!passwordCheck) {
            return res.status(401).json(resInvalidUser)
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
            },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        )

        return res.status(200).json({
            status: true,
            result: {
                username: user.username,
                token: token,
            },
            message: "Successfully login"
        })
    } catch (error) {
        return next(error)
    }
}

module.exports.register = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, data: null, message: "Photo not attach" })
        }
        const { username, password, email, full_name } = req.body
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: 60 })
        const hash = await passwordHelper.encryptPassword(password)
        const user = await UserModel.create({
            username,
            password: hash,
            email,
            full_name,
            register_token: token,
            foto_url: req.file.filename
        })
        const verificationLink = `${process.env.CLIENT_URL}activate-account`
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        })

        let mailOptions = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: 'Activate Account',
            html: `Hi there! <br/><br/>
              Please click on the link below to activate your account:<br/>
              <a href="${verificationLink}" target="_blank">${verificationLink}</a><br/><br/>
              Thank You.`
        }

        transporter.sendMail(mailOptions, async function (err, info) {
            if (err) throw new Error(err)
        })
        return res.status(200).json({
            status: true,
            result: req.body,
            message: "Successfully register"
        })

    } catch (error) {
        return next(error)
    }
}

module.exports.activateUser = async (req, res, next) => {
    try {
        const { id } = req.body
        await UserModel.update({
            status: true,
            register_token: null
        }, { where: { id } })
        return res.status(200).json({
            status: true,
            result: req.body,
            message: "Successfully"
        })
    } catch (error) {
        return next(error)
    }
}


module.exports.forgotPassword = async (req, res, next) => {
    const email = req.body.email;

    const user = await UserModel.findOne({
        where: {
            email: email,
        },
    })

    if (!user) {
        return res.status(404).json({
            status: false,
            result: req.body,
            message: "User not found"
        })
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: 60 })
    let verificationLink = `${process.env.CLIENT_URL}reset-password/${token}`

    // Send the email
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    let mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Forgot Password',
        html: `Hi there! <br/><br/>
              Please click on the link below to reset your password:<br/>
              <a href="${verificationLink}" target="_blank">${verificationLink}</a><br/><br/>
              Thank You.`
    }

    // await transporter.sendMail(mailOptions)
    await transporter.sendMail(mailOptions, async function (err, info) {
        if (err) throw new Error(err)

        await UserModel.update({
            forgot_pass_token: token
        }, {
            where: {
                email: email
            }
        })
    })
    return res.status(200).json({
        status: true,
        result: req.body,
        message: "Successfully send mail"
    })
}

module.exports.resetPassword = async (req, res, next) => {
    let token = req.body.token
    let hash = null
    if (req.body.password) {
        hash = await passwordHelper.encryptPassword(req.body.password);
    }

    const user = await UserModel.findOne({
        where: {
            forgot_pass_token: token,
        },
    });

    if (!user) {
        return res.status(400).json({
            status: true,
            result: null,
            message: "User not found"
        })
    }

    await UserModel.update({
        password: hash,
    }, {
        where: {
            forgot_pass_token: token,
        }
    })

    await UserModel.update({
        forgot_pass_token: null,
    }, {
        where: {
            forgot_pass_token: token,
        }
    })

    return res.status(200).json({
        status: true,
        result: null,
        message: "Successfully reset password"
    })
}