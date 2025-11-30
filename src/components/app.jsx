import { INITIAL_STATE } from "../initialState";
import TodoList from "./todoList";
import { useState } from "react";

export default function App() {

    const [todos, setTodos] = useState(INITIAL_STATE)
    const [filter, setFilter] = useState("All")
    const [search, setSearch] = useState('')

    // sorting todos by date and time
    const sortedTodos = [...todos].sort((a, b) => {
        const da = new Date(`${a.date}T${a.time || '00:00'}`);
        const db = new Date(`${b.date}T${b.time || '00:00'}`);
        return da - db;
    });

    const filteredByCategory = sortedTodos.filter(todo => {
        switch(filter) {
            case "Only done" : return todo.done === true ;
            case "Only undone" : return todo.done === false ;
            case "Work Todos" : return todo.tag === 'Work' ;
            case "Personal Todos" : return todo.tag === 'Personal' ;
            case "Home Todos" : return todo.tag === 'Home' ;
            case "Health Todos" : return todo.tag === 'Health' ;
            case "Shopping Todos" : return todo.tag === 'Shopping' ;
            case "Sport Todos" : return todo.tag === 'Sport' ;
            case "Other Todos" : return todo.tag === 'Other' ;
            default : return true ;
        }
    })

    const filteredTodos = filteredByCategory.filter(todo =>
        todo.label.toLowerCase().includes(search.trim().toLowerCase())
    )

    const handleAddTodo = newTodo => {
        setTodos(prevState => {
            return [
                ...prevState,
                {
                    id : newTodo.id,
                    label : newTodo.label,
                    details : newTodo.details,
                    tag : newTodo.tag,
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

    const handleEditTodo = editedTodo => {
        setTodos(prevState => prevState.map(todo => (todo.id === editedTodo.id) ? editedTodo : todo))
    }

    const toggleTodo = id => {
        setTodos(prevState => prevState.map(todo => (todo.id === id) ? {...todo, done : !todo.done} : todo))
    }
    
    return(
        <div className="container m-5">
            <TodoList filter={filter} setFilter={setFilter} setSearch={setSearch} onToggleTodo={toggleTodo} onAddTodo={handleAddTodo} onDeleteTodo={handleDeleteTodo} onEditTodo={handleEditTodo} todos={filteredTodos} />
        </div>
    )
}