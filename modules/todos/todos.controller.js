const Todo = require('../../models/todo');
const validatons = require('./todos.validation'); 

const getTodos = async (req, res) => {
    const { user } = req;

    const todos = await Todo.find({ user : user._id });
    const data = todos.map(todo => ({
        text : todo.text,
        _id : todo._id,
        isDone : todo.isDone,
        created_at : todo.date,
    }));

    return res.json({ data });
}

const createTodo = async (req, res) => {
    const { user, body } = req;
    const { errors, isValid } = validatons.validateTodo(body);

    if (!isValid) return res.status(400).json({ errors });

    const newTodo = new Todo({
        user : user._id,
        text : body.text
    });

    const data = await newTodo.save();
    return res.json({ data : { text : data.text, _id : data._id, isDone : data.isDone }, message : 'Successfully saved todo' });
}


const toggleTodo = async (req, res) => {
    const { params: { id }, user } = req;
    if (!id) return res.status(400).json({ message : 'Invalid Id' });

   try {
       const todo = await Todo.findById(id);
       if (user._id.toString() !== todo.user.toString()) return res.status(401).json({ message : 'Unauthorized to update this todo' });

       todo.isDone = !todo.isDone;
       const updatedTodo = await todo.save();
       return res.json({ data : {
           text: updatedTodo.text,
           _id: updatedTodo._id,
           isDone: updatedTodo.isDone,
           created_at: updatedTodo.date,
       }});
   } catch(e) {
       return res.status(404).json({ message: 'Todo not found' });
   }
};


const deleteTodo = async (req, res) => {
    const { params: { id }, user } = req;
    if (!id) return res.status(400).json({ message: 'Invalid Id' });

    try {
        const todo = await Todo.findById(id);
        if (user._id.toString() !== todo.user.toString()) return res.status(401).json({ message: 'Unauthorized to delete this todo' });
        
        await todo.remove();
        return res.json({ message : 'Todo successfully deleted' });
    } catch (e) {
        return res.status(404).json({ message: 'Todo not found' });
    }
};

module.exports = {
    getTodos,
    createTodo,
    toggleTodo,
    deleteTodo,
}