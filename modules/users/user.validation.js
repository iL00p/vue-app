const validator = require('validator');
const _ = require('lodash');

const validateEmail = (email, errors) => {
    if (_.isEmpty(email) && typeof email !== 'string') errors.email = 'Email is required';
    else if (!validator.isEmail(email)) errors.email = 'Invalid Email';
}

const validateUser = user => {
    const errors = {};
    if (_.isEmpty(user.name) && typeof user.name !== 'string') errors.name = 'Name is required';
    validateEmail(user.email, errors);
    if (_.isEmpty(user.password) && typeof user.password !== 'string') errors.password = 'Password is required';
    else if (user.password.length < 6) errors.password = 'Minimum 6 characters required';
    else if (_.isEmpty(user.confirm_password) && typeof user.confirm_password !== 'string') errors.confirm_password = 'Confirm Password is required';
    else if (!_.isEqual(user.password, user.confirm_password)) errors.password = 'Password mismatch';
   
    return {
        errors,
        isValid : _.isEmpty(errors),
    }
};

const validateLogin = user => {
    const errors = {};
    validateEmail(user.email, errors);
    if (_.isEmpty(user.password) && typeof user.password !== 'string') errors.password = 'Password is required';

    return {
        errors,
        isValid: _.isEmpty(errors),
    }
}

module.exports = {
    validateUser,
    validateLogin
}