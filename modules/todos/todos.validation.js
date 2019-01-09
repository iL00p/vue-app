const { isEmpty } = require('lodash');

const validateTodo = todo => {
    const errors = {};
    if (isEmpty(todo.text)) errors.text = 'Todo is required';

    return {
        errors,
        isValid : isEmpty(errors),
    }
}

module.exports = {
    validateTodo,
}