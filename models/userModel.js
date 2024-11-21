const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    email: {type: String, required: [true, 'Please input an email'], unique: true, lowercase: true, validate: [isEmail, 'Please input a valid email'] },
    password: {type: String, required: [true, 'Please input your password'], minLength: [6, 'Password must be at keast 6 characters']}
}, {timestamps: true})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    console.log('user about to be created', this, this.password)
    next()
})

userSchema.post('save', function (doc, next) {
    console.log('new user created', doc)
    next()
})

//static method to login users to the application
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email})
    console.log(user.email)
    console.log(password)
    console.log(user.password)
    console.log(email, 'User Input Mail')

    if (user) {
        console.log(`User Input Password: ${password}`);
        console.log(`Hashed Password: ${user.password}`);
        const auth = await bcrypt.compare(password, user.password)
        console.log(`Auth Result: ${auth}`);
        //console.log(auth)
        if (auth) {
            return user
        }
        throw Error('passwords did not match')
    }
    throw Error('User not found')
}

const User = mongoose.model('user', userSchema)

module.exports = User;