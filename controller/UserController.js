const UserModel = require("../models/UserModel")

module.exports.changePhoto = async (req, res, next) => {
    try {
        const { id } = req.body
        if (!req.file) {
            return res.status(400).json({
                status: false,
                data: null,
                message: "Must attach photo"
            })
        }

        await UserModel.update({
            foto_url: req.file.filename
        }, { where: { id } })
        return res.status(200).json({
            status: false,
            data: req.body,
            message: "Successfuly change photo"
        })
    } catch (error) {
        return next(error)
    }
}