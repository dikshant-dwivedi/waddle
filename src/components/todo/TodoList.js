import React, { Component } from 'react'
import './TodoList.css'

export class TodoList extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="todolist">
                <p className="title">To-do List</p>
            </div>
        )
    }
}

export default TodoList
