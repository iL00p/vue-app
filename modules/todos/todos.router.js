const { Router } = require('express');
const passport = require('passport');

const todosController = require('./todos.controller');

const router = Router();

router.get('/', passport.authenticate('jwt', { session : false }), todosController.getTodos);

router.post('/', passport.authenticate('jwt', { session: false }), todosController.createTodo);

router.put('/:id', passport.authenticate('jwt', { session : false}), todosController.toggleTodo);

router.delete('/:id', passport.authenticate('jwt', { session: false }), todosController.deleteTodo);

module.exports = router;