import React, { useContext, useState, useEffect } from 'react'
import UserContext from '../../context/UserContext'
import { v4 as uuid } from 'uuid';
import Paper from '@material-ui/core/Paper'
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import './TodoList.css'
export function TodoList() {

    const { userData } = useContext(UserContext)
    const [todos, setTodo] = useState([])
    const [title, setTitle] = useState('')
    const [open, setOpen] = useState(false)


    useEffect(() => {
        if (userData.user === undefined) {
            setTodo([])
        }
        else {
            let allTodos = userData.user.todo
            allTodos.map(todo => {
                todo["editDisabled"] = "true"
                todo["id"] = todo._id
                delete todo._id
                return todo
            })
            setTodo(userData.user.todo)
        }
    }, [userData.user])

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    };

    function onChangeTodo(e) {
        setTitle(e.target.value)
    }

    const onAddItem = async () => {
        if (userData.user === undefined) {
            const newTodo = {
                id: uuid(),
                title: title,
                isCompleted: false,
                editDisabled: true
            }
            setTodo([...todos, newTodo])
            setTitle('')
        }
        else {
            const reqObj = {
                "id": userData.user.id,
                "todo": {
                    "title": title,
                    "isCompleted": false
                }
            }
            let response = await axios.post("http://localhost:5000/todos/add", reqObj)
            let newTodo = response.data
            newTodo["editDisabled"] = "true"
            newTodo["id"] = newTodo._id
            delete newTodo._id
            setTodo(userData.user.todo)
            setTodo([...todos, newTodo])
            setTitle('')
        }
    }

    const markComplete = async (id) => {
        if (userData.user === undefined) {
            setTodo(todos.map(todo => {
                if (todo.id === id) {
                    todo.isCompleted = !todo.isCompleted
                }
                return todo
            }))
        }
        else {
            let completed = true
            setTodo(todos.map(todo => {
                if (todo.id === id) {
                    todo.isCompleted = !todo.isCompleted
                    completed = todo.isCompleted
                }
                return todo
            }))
            const reqObj = {
                "id": userData.user.id,
                "todoId": id,
                "isCompleted": completed
            }
            await axios.post("http://localhost:5000/todos/markComplete", reqObj)
        }
    }

    const deleteTodo = async (id) => {
        if (userData.user === undefined) {
            setTodo([...todos.filter(todo => todo.id !== id)])
            setOpen(true)
        }
        else {
            const reqObj = {
                "id": userData.user.id,
                "todoId": id
            }
            await axios.post("http://localhost:5000/todos/delete", reqObj)
            setTodo([...todos.filter(todo => todo.id !== id)])
            setOpen(true)
        }
    }

    function editTodo(id) {
        setTodo(todos.map(todo => {
            if (todo.id === id) {
                todo.editDisabled = !todo.editDisabled
            }
            return todo
        }))
    }

    const onSubmitEdit = async (id, editTitle) => {

        if (userData.user === undefined) {
            setTodo(todos.map(todo => {
                if (todo.id === id) {
                    todo.editDisabled = !todo.editDisabled
                    todo.title = editTitle
                }
                return todo
            }))
        }
        else {
            setTodo(todos.map(todo => {
                if (todo.id === id) {
                    todo.editDisabled = !todo.editDisabled
                    todo.title = editTitle
                }
                return todo
            }))
            const reqObj = {
                "id": userData.user.id,
                "todoId": id,
                "title": editTitle
            }
            await axios.post("http://localhost:5000/todos/edit", reqObj)
        }
    }
    return (
        <div className="todolist">
            <h4 className="title">To-do List</h4>
            <AddTodo
                title={title}
                onChangeTodo={onChangeTodo}
                onAddItem={onAddItem} />
            <section className="todos">
                <Todos todos={todos}
                    markComplete={markComplete}
                    deleteTodo={deleteTodo}
                    editTodo={editTodo}
                    onSubmitEdit={onSubmitEdit} />
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    message="Note deleted"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </section>
        </div>
    )
}

export default TodoList

function AddTodo(props) {
    function onChangeTodo(e) {
        e.preventDefault()
        props.onChangeTodo(e)
    }

    function onAddItem(e) {
        e.preventDefault()
        props.onAddItem()
    }

    return (
        <form onSubmit={onAddItem} className="add-todo-form">
            <input type="text"
                className="add-todo-input"
                onChange={onChangeTodo}
                value={props.title} />
            <input type="submit"
                className="add-todo-submit"
                value="Add"
                disabled={(props.title.trim() === '') ? true : false} />
        </form>
    )
}

function Todos(props) {
    return props.todos.map((todo) => (
        <TodoItem key={todo.id}
            todo={todo}
            markComplete={props.markComplete}
            deleteTodo={props.deleteTodo}
            editTodo={props.editTodo}
            onSubmitEdit={props.onSubmitEdit} />
    ));
}


class TodoItem extends React.Component {
    constructor() {
        super()
        this.state = {
            editTitle: "",
        }
        this.onEditInputChange = this.onEditInputChange.bind(this)
        this.onSubmitEdit = this.onSubmitEdit.bind(this)
        this.deleteTodo = this.deleteTodo.bind(this)
    }

    onEditInputChange(e) {
        e.preventDefault()
        this.setState({
            editTitle: e.target.value
        })
    }

    onSubmitEdit(e) {
        e.preventDefault()
        if (this.state.editTitle.trim() === '') {
            this.props.editTodo(this.props.todo.id)
        }
        else {
            this.props.onSubmitEdit(this.props.todo.id, this.state.editTitle)
        }
    }

    deleteTodo(e) {
        e.preventDefault()
        this.props.deleteTodo(this.props.todo.id)
    }

    render() {
        const { id, title, isCompleted, editDisabled } = this.props.todo;
        return (
            <Paper elevation={3} style={{ borderRadius: "10px" }}>
                <section className="todo-item"
                    style={{ background: isCompleted ? '#fbe3e8' : '#FFF685' }}>
                    <div key={id}
                        className="todo-item-saved"
                        style={{
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            display: editDisabled ? 'block' : 'edit'
                        }} >
                        <div class="checkbox-container">
                            <label class="checkbox-label">
                                <input type="checkbox"
                                    className="checkbox"
                                    defaultChecked={isCompleted}
                                    onChange={this.props.markComplete.bind(this, id)} />
                                <span class="checkbox-custom rectangular"></span>
                            </label>
                        </div>
                        {title}
                        <IconButton onClick={this.deleteTodo.bind(this)}
                            size="medium"
                            style={{
                                color: "#000000",
                                float: "right",
                                fontSize: "10px",
                                marginTop: "-10px",
                                marginRight: "-5px",
                                outline: 'none',
                            }}><DeleteIcon style={{ fontSize: "22px" }} /></IconButton>
                        <IconButton onClick={this.props.editTodo.bind(this, id)}
                            size="medium"
                            style={{
                                color: "#000000",
                                float: "right",
                                fontSize: "5px",
                                marginRight: "-5px",
                                marginTop: "-10px",
                                outline: 'none'
                            }}><EditIcon style={{ fontSize: "22px" }} /></IconButton>
                    </div>
                    <form className="edit-todo-form"
                        onSubmit={this.onSubmitEdit}
                        style={{ display: editDisabled ? "none" : "flex", width: '100%' }}>
                        <input type="text"
                            value={this.state.editTitle}
                            onChange={this.onEditInputChange}
                            className="edit-todo-input" />
                        <input type="submit"
                            className="edit-todo-submit"
                            value="Save"
                            disabled={(this.state.editTitle.trim() === '') ? true : false} />
                    </form>
                </section>
            </Paper>
        )
    }
}





