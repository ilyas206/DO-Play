import TodoList from "./todoList";
import { useState } from "react";

const INITIAL_STATE = [
    {
        id : 1,
        label : "Finish project report",
        details : "Complete the quarterly report and submit to manager",
        date : "2025-11-20",
        time : "17:00",
        done : true
    },
    {
        id : 2,
        label : "Buy groceries",
        details : "Milk, eggs, bread, vegetables, and coffee",
        date : "2025-11-16",
        time : "10:30",
        done : false
    },
    {
        id : 3,
        label : "Doctor appointment",
        details : "Annual checkup with Dr. Smith at clinic",
        date : "2025-11-18",
        time : "14:00",
        done : false
    },
    {
        id : 4,
        label : "Team meeting",
        details : "Discuss Q4 goals and project timeline",
        date : "2025-11-17",
        time : "09:00",
        done : true
    },
    {
        id : 5,
        label : "Pay electricity bill",
        details : "Online payment due before end of month",
        date : "2025-11-25",
        time : "16:30",
        done : false
    },
    {
        id : 6,
        label : "Call mom",
        details : "Weekly check-in call",
        date : "2025-11-22",
        time : "19:00",
        done : false
    }
]

export default function App() {

    const [todos, setTodos] = useState(INITIAL_STATE)
    const [filter, setFilter] = useState("All")

    const filteredTodos = todos.filter(todo => {
        if(filter === "Only done") return todo.done === true ;
        if(filter === "Only undone") return todo.done === false ;
        return true ;
    })

    const handleAddTodo = newTodo => {
        setTodos(prevState => {
            return [
                ...prevState,
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

    const handleDeleteTodo = id => {
        setTodos(prevState => prevState.filter(todo => todo.id !== id))
    }

    const handleUpdateTodo = updatedTodo => {
        setTodos(prevState => prevState.map(todo => (todo.id === updatedTodo.id) ? updatedTodo : todo))
    }

    const toggleTodo = id => {
        setTodos(prevState => prevState.map(todo => (todo.id === id) ? {...todo, done : !todo.done} : todo))
    }
    
    return(
        <div className="container m-5">
            <TodoList filter={filter} setFilter={setFilter} onToggleTodo={toggleTodo} onAddTodo={handleAddTodo} onDeleteTodo={handleDeleteTodo} onUpdateTodo={handleUpdateTodo} todos={filteredTodos} />
        </div>
    )
}