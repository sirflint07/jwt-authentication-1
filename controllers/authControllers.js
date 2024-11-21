const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

//handle errors
const handleError = (err) => {
    console.log(err.message, err.code)
    let errors = {email: '', password: ''}

    // duplicate errors
    if(err.code === 11000) {
        errors.email = 'the email is already registered'
        return errors
    }

    if (err.message.includes('email')) {
        errors.email = 'User not registered'
        return errors;
    }

    if (err.message.includes('password')) {
        errors.password = 'Password not matched'
        return errors
    }

    if (err.message === 'incorrect email' && err.message === 'incorrect password') {
        errors.password = 'Password not matched'
        errors.email = 'User not registered'
        return errors
    }

    if (err.message.includes('user validation failed')) {
       (Object.values(err.errors)).forEach(({properties}) => {
       errors[properties.path] = properties.message
       })
       return errors
    }
}

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({id}, 'golden designs', {expiresIn: maxAge})
}

module.exports = {
    signup_get: (req, res) => {res.render('signup')},
    users_get: async (req, res) => {
        const page = req.query.p ?? 0
        const numBooks = 5
        try {
            const users = await User.find({}).skip(page * numBooks).limit(numBooks)
            if (users) {
                return res.status(200).json(users)
            }
            return res.status(400).json({msg: 'could not find db'})
        } catch (error) {
            res.status(404).json(error)
        }
    },

    signup_post: async (req, res) => {
        const formData = req.body;
        try {
            const user = await User.create(formData)
            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
            return res.status(200).json({user: user._id})
        } catch (err) {
            const errors = handleError(err)
            res.status(400).json({errors});
        }
    },

    login_post: async (req, res) => {
        
        try {
            const {email, password} = req.body;
            const user = await User.login(email, password)
            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
            return res.status(200).json({user: user._id})
        } catch (err) {
        //   return res.status(400).json({})
        const errors = handleError(err)
        return res.status(400).json({ errors });
        }
    },

    login_get: (req, res) => {res.render('login')},

    

    signup_get_delete: async (req, res) => {
        const id = req.params.id
        try {
            if(id) {
                const user = await User.findByIdAndDelete(id)
                return res.status(200).json(user)
            }
            res.status(400).json({err: 'could not find user with the id'})
        } catch (error) {
            res.status(400).json({error: 'could not delete user from db'})
        }
    },

    signup_get_update: async (req, res) => {
        const id = req.params.id
        const formData = req.body
        try {
            if(id) {
                const user = await User.findByIdAndUpdate(id, formData)
                return res.status(200).json(user)
            }
            res.status(400).json({err: 'could not find user with the id'})
        } catch (error) {
            res.status(400).json({error: 'could not update user from db'})
        }
    }
}