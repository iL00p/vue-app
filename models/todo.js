const { Schema, model } = require('mongoose');

const TodoSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users'
    },
    date : {
        type : Date,
        default : Date.now()
    },
    text : {
        type : String,
        required : true
    },
    isDone : {
        type : Boolean,
        default : false,
    }
});

const Todo = model('todos', TodoSchema);

module.exports = Todo;