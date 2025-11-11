import TodoList from "./todoList";
import { useState } from "react";


export default function App() {
    const [todos, setTodos] = useState([
        {
            id : 1,
            label : "Watching React tutorials",
            details : "Learning some Redux concepts with recent RTK features",
            date : "2025-11-21",
            time : "07:33",
            done : true
        }
    ])

    const handleAddTodo = (newTodo) => {
        setTodos(todos => {
            return [
                ...todos,
                {
                    id : newTodo.id,
                    label : newTodo.label,
                    details : newTodo.details,
                    date : newTodo.date,
                    time : newTodo.time,
                    done : false
                }
            ]
        })
    }

    const handleDeleteTodo = (id) => {
        setTodos(todos => todos.filter(todo => todo.id !== id))
    }

    const handleUpdateTodo = (updatedTodo) => {
        setTodos(todos.map(todo => (todo.id === updatedTodo.id) ? updatedTodo : todo))
    }

    const toggleTodo = (id) => {
        setTodos(todos => {
            return todos.map(todo => 
                todo.id === id ? {...todo, done : !todo.done} : todo
            )
        })
    }

    return(
        <div className="container m-5">
            <TodoList onToggleTodo={toggleTodo} onAddTodo={handleAddTodo} onDeleteTodo={handleDeleteTodo} onUpdateTodo={handleUpdateTodo} todos={todos}/>
        </div>
    )
}