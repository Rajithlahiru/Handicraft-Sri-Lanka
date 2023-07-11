const Vender = require('../../models/vender/Vender')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../../errors')
const bcrypt = require('bcryptjs')

const register = async (req, res) =>{
    const vender = await Vender.create({...req.body})
    const token = vender.createJWT()
    res.status(StatusCodes.CREATED).json({ vender: { name: vender.name }, token })
}

const login = async (req, res) =>{
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const vender = await Vender.findOne({ email })
    if (!vender) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await vender.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // compare password
    const token = vender.createJWT();
    res.status(StatusCodes.OK).json({ vender: { name: vender.name }, token })

}

module.exports ={
    register,
    login,
}