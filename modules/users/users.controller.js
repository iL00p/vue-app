const bcrypt = require('bcryptjs');
const _ = require('lodash');
var jwt = require('jsonwebtoken');

const User = require('../../models/user');
const validations = require('./user.validation');
const { secret, token_expiry } = require('../../config/keys');

const getAllUsers = async (req, res) => {
    const users = await User.find({});
    const allUsers = users.map(user => ({ name : user.name, email : user.email }));

    return res.json(allUsers);
};

const register = async (req, res) => {
    const { body } = req;
    const { errors, isValid } = validations.validateUser(body);

    if (!isValid) return res.status(400).json({ errors });

    try {
        const user = await User.findOne({ email: body.email });
        if (!_.isEmpty(user)) return res.status(400).json({ message: 'Email already exists' });
        const newUser = new User({
            name: body.name,
            email: body.email,
            password: body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;

            bcrypt.hash(body.password, salt, async (er, hash) => {
                if (er) throw er;
                newUser.password = hash;

                const data = await newUser.save()
                return res.json({ data, message: 'User created succressfully!' });
            })
        })
    } catch (e) {
        console.log('err::', e);
        return res.status(500).json({ message: 'Oops... Something went wrong' });
    }
};

const login = async (req, res) => {
    const { body } = req;
    const { errors, isValid } = validations.validateLogin(body);
    if (!isValid) return res.status(400).json({ errors });

    const user = await User.findOne({ email : body.email });
    if (_.isEmpty(user)) return res.status(404).json({ message : 'User not found!' });
    
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) return res.status(400).json({ message : 'Invalid Password' });

    const token = jwt.sign({
        email : user.email,
        id    : user._id
    }, secret, { expiresIn : token_expiry });

    return res.status(200).json({
        data : {
            name  : user.name,
            email : user.email,
            token
        }
    });
};

const getUserData = (req, res) => {
    const { user } = req;

    return res.json({ data : { name : user.name, id : user._id, email : user.email } });
}

module.exports = {
    getAllUsers,
    register,
    login,
    getUserData,
}