import { useEffect, useRef, useState } from "react";
import { Modal } from 'bootstrap';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { Box, IconButton, Tooltip } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from '@mui/icons-material/Clear';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import "../todoList.css";
import DeletingModal from "./deletingModal";
import { DANGER_COLOR, MAIN_COLOR, SECOND_COLOR, WARNING_COLOR } from "../style";
import { handleTagColor, handleTagIcon } from "../tags";
import Scroller from "./scroller";
import AddingModal from "./addingModal";
import EditingModal from "./editingModal";
import ViewingModal from "./viewingModal";
import { handlePriorityColor } from "../priorities";

export default function TodoList({todos, onToggleTodo, onAddTodo, onDeleteTodo, onEditTodo, setSearch, setFilter, filter}) {

    const [selectedTodo, setSelectedTodo] = useState(null)
    const [isAddAlertShowed, setIsAddAlertShowed] = useState(false)
    const [isEditAlertShowed, setIsEditAlertShowed] = useState(false)
    const [isDeleteAlertShowed, setIsDeleteAlertShowed] = useState(false)
    const [isProhibAlertShowed, setIsProhibAlertShowed] = useState(false)
    const [theme, setTheme] = useState("dark")
    const [currentDate, setCurrentDate] = useState(new Date())
    
    useEffect(() => {
        const update = () => setCurrentDate(new Date());

        update();

        const now = new Date();
        const delay =
            (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        const timeoutId = setTimeout(() => {
            update(); 

            const intervalId = setInterval(update, 60000);

            return () => clearInterval(intervalId);

        }, delay);

        return () => clearTimeout(timeoutId);
        }, [])

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme)
    }, [theme])

    const searchRef = useRef()
    const filterRef = useRef()

    const handleAddClick = () => {
        const modal = new Modal(document.getElementById("addModal"))
        modal.show()
    }

    const handleDeleteClick = todo => {
        setSelectedTodo(todo);
        const modal = new Modal(document.getElementById("deleteModal"));
        modal.show();
    };

    const handleEditClick = todo => {
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("editModal"))
        modal.show()
    }

    const handleViewClick = todo => {
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("viewModal"))
        modal.show()
    }

    const togglingTodo = (id, isPast) => {
        if(!isPast){
            setIsProhibAlertShowed(true)

            setTimeout(() => {
                setIsProhibAlertShowed(false)
            }, 3000)
        }else{
            onToggleTodo(id)
        }
    }

    const handleCheckboxOpacity = isPast => {
        if(theme === "dark"){
            if(isPast) return "cbx-light cursor"
            else return "cbx-dark" 
        }else{
            if(isPast) return "cbx-dark cursor"
            else return "cbx-light"
        }
    }

    const displayTodos = () => {
        const currentYear = new Date().getFullYear().toString()

        return todos.map(todo => {
            // date-only for display
            const todoDate = new Date(todo.date)
            const displayDate = new Date(todo.date)
            displayDate.setHours(0, 0, 0, 0)
            const day = displayDate.getDate().toString()
            const month = displayDate.toLocaleDateString("en-GB", { month: "short" })
            const year = displayDate.getFullYear().toString()
            // parse time and build scheduled datetime
            const [hStr, mStr] = (todo.time || "00:00").split(":")
            const hours = parseInt(hStr, 10) || 0
            const minutes = parseInt(mStr, 10) || 0
            const scheduled = new Date(todoDate)
            scheduled.setHours(hours, minutes, 0, 0)

            // compare scheduled datetime to now (strictly in the past)
            const isPast = scheduled.getTime() < currentDate.getTime()
            const rowClass = `text-center align-middle ${theme === "dark" ? "dark-mode" : "light-mode"}`
            const columnClass = isPast ? "text-muted" : "fw-bold"
            const labelClass = isPast && "text-muted fw-light" 

            const checkBoxId = `cbx-${todo.id}`
 
            const deleteIconColor = todo.done ? DANGER_COLOR : "#9e9e9eff"
 
            return <tr key={todo.id} onClick={() => handleViewClick(todo)} className={rowClass}>
                <td className="align-middle text-center">
                    <div className="d-inline-flex align-items-center justify-content-center">
                        <input type="checkbox" 
                        className="hidden-xs-up"
                        id={checkBoxId}
                        checked={todo.done} 
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {togglingTodo(todo.id, isPast); e.stopPropagation()}}/>
                        <label htmlFor={checkBoxId} className={handleCheckboxOpacity(isPast)} onClick={(e) => e.stopPropagation()}></label>
                    </div>
                </td>
                <td><h5 className={labelClass}>{todo.label}</h5></td>
                <td className={columnClass}>
                    <span style={{color : handlePriorityColor(todo.priority)}}>
                        <FiberManualRecordIcon fontSize="low" sx={{marginBottom : "3px", marginRight : "2px"}}/> 
                        {todo.priority}
                    </span>
                </td>
                <td className={columnClass}>{day} {month}{currentYear !== year && ` - ${year}`}</td>
                <td className={columnClass}>{hStr} <b>:</b> {mStr}</td>
                <td className="align-middle">
                    <Box
                        sx={{
                            backgroundColor: handleTagColor(todo.tag),
                            color : "#ffffffff",
                            height : "35px",
                            width : "35px",
                            p : "10px",
                            m : "0 auto",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow : `0 0 13px 3px ${handleTagColor(todo.tag)}`
                        }}
                        >
                        {handleTagIcon(todo.tag)}
                    </Box>
                </td>
                <td className="align-middle">
                    <Tooltip title="Edit" arrow>
                        <IconButton sx={{color : SECOND_COLOR, marginTop : "3px", marginBottom : "1px"}} onClick={(e) => {handleEditClick(todo); e.stopPropagation()}} aria-label="Edit">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                        <IconButton sx={{color : deleteIconColor, marginTop : "3px", marginBottom : "1px"}} onClick={(e) => {handleDeleteClick(todo); e.stopPropagation()}} aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    
                </td>   
            </tr>
        })
    }

    const displayCurrentDate = () => {
        const currentDay = String(currentDate.getDate())
        const currentWeekDay = currentDate.toLocaleDateString("en-GB", { weekday: "long" })
        const currentMonth = currentDate.toLocaleDateString("en-GB", { month: "long" })
        const currentYear = currentDate.getFullYear().toString().slice(2)

        const hours = String(currentDate.getHours()).padStart(2, '0')
        const minutes = String(currentDate.getMinutes()).padStart(2, '0')

        return(
            <div className="card p-3 shadow" style={{backgroundColor : theme === "dark" ? "#31363bff" : "#dff2e0ff"}}>
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="fw-light">{currentWeekDay} {currentDay} {currentMonth} {currentYear}</h4>
                    <h4 className="fw-light display-6">{hours} : {minutes}</h4>
                </div>
            </div>
        )
    }

    const displaySearchBar = () => {

        const handleSearch = () => {
            const searchValue = searchRef.current.value
            const filterValue = filterRef.current.value
            if(searchValue !== '' || filterValue !== ''){
                setFilter(filterValue)
                setSearch(searchValue)
            }
        }

        const handleReset = () => {
            setFilter("All")
            setSearch("")
            searchRef.current.value = ""
            filterRef.current.value = ""
        }

        return(
            <div className="row align-items-center my-3 w-100 g-2">

            <div className="col-6">
                <input
                type="text"
                className="form-control shadow-none green-input-border"
                placeholder="Search by label"
                ref={searchRef}
                />
            </div>

            <div className="col-3">
                <select
                className="form-select shadow-none green-input-border"
                ref={filterRef}
                >
                <option value="">Filter Todos</option>
                <option value="Only done">Only Done</option>
                <option value="Only undone">Only Undone</option>
                <option value="Work Todos">Work</option>
                <option value="Personal Todos">Personal</option>
                <option value="Home Todos">Home</option>
                <option value="Health Todos">Health</option>
                <option value="Sport Todos">Sport</option>
                <option value="Shopping Todos">Shopping</option>
                </select>
            </div>

            <div className="col-2 d-flex align-items-center gap-2 justify-content-center w-auto">
               <Tooltip title="Search" arrow>
                    <IconButton sx={{ color: MAIN_COLOR }} onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
               </Tooltip>

                <Tooltip title="Clear" arrow>
                    <IconButton sx={{ color: "#9e9e9eff" }} onClick={handleReset}>
                        <RestartAltIcon />
                    </IconButton>
                </Tooltip>
            </div>

            <div className="col-auto d-flex align-items-center">
                <div className="vr mx-3 mt-1" style={{ height: "28px", opacity: 0.4 }}></div>
                    <h3 className="fw-light mb-0">{todos.length} Todo(s)</h3>
                </div>
            </div>
        )
    }

    return(
        <div className="container">
            <Scroller/>
            <div className="my-2" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050, width: '350px' }}>
                <Collapse in={isAddAlertShowed}>
                    <Alert
                        variant="filled"
                        icon={<AddIcon fontSize="inherit"/>}
                        onClose={() => setIsAddAlertShowed(false)}
                        sx={{
                            mb : 1,
                            backgroundColor: MAIN_COLOR,    
                            color: "rgba(0,0,0,0.87)",      
                            '& .MuiAlert-icon': { color: 'inherit' } 
                        }}>
                        <b>Todo added successfully</b>
                    </Alert>
                </Collapse>
                <Collapse in={isEditAlertShowed}>
                    <Alert
                        variant="filled"
                        icon={<EditOutlinedIcon fontSize="inherit"/>}
                        onClose={() => setIsEditAlertShowed(false)}
                        sx={{
                            mb : 1, 
                            backgroundColor: SECOND_COLOR,
                            color: "rgba(0,0,0,0.87)",
                            '& .MuiAlert-icon': { color: 'inherit' }
                        }}>
                        <b>Todo updated successfully</b>
                    </Alert>
                </Collapse>
                <Collapse in={isDeleteAlertShowed}>
                    <Alert
                        variant="filled"
                        icon={<ClearIcon fontSize="inherit"/>}
                        onClose={() => setIsDeleteAlertShowed(false)}
                        sx={{
                            mb : 1,
                            backgroundColor: DANGER_COLOR,
                            color: "rgba(0,0,0,0.87)",
                            '& .MuiAlert-icon': { color: 'inherit' }
                        }}>
                        <b>Todo deleted permanently</b>
                    </Alert>
                </Collapse>
                <Collapse in={isProhibAlertShowed}>
                    <Alert
                        variant="filled"
                        icon={<RemoveDoneIcon fontSize="inherit"/>}
                        onClose={() => setIsProhibAlertShowed(false)}
                        sx={{
                            mb : 1,
                            backgroundColor: WARNING_COLOR,
                            color: "rgba(0,0,0,0.87)",
                            '& .MuiAlert-icon': { color: 'inherit' }
                        }}>
                        <b>Future Todos cannot be marked as done</b>
                    </Alert>
                </Collapse>
            </div>
            {displayCurrentDate()}
            <div className="d-flex align-items-center justify-content-between mt-3">
                <h2 className="display-5"><span style={{color : MAIN_COLOR}}>DO</span>Play</h2>
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <Tooltip title="Add" arrow>
                        <IconButton sx={{color : MAIN_COLOR}} onClick={handleAddClick} aria-label="Add">
                            <AddIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Theme" arrow>
                        <div className="toggle-switch" >
                            <label className="switch-label" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="checkbox" onChange={() => setTheme(theme === "dark" ? "light" : "dark")}/>
                                <span className="slider"></span>
                            </label>
                        </div> 
                    </Tooltip>
                </div> 
            </div>
            <hr/>
            {displaySearchBar()}
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th>Status</th>
                        <th>Label</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Tag</th>
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        todos.length > 0 ? 
                        displayTodos() :
                        <tr>
                            <td colSpan={7} align="center">
                                {filter === "Only done" || filter === "Only undone" ? `No ${filter} Todos` : `You have no ${filter}`}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>

            {/* Viewing modal */}
            <ViewingModal selectedTodo={selectedTodo}/>

            {/* Adding modal */}
            <AddingModal onAddTodo={onAddTodo} setIsAddAlertShowed={setIsAddAlertShowed}/>

            {/* Editing modal */}
            <EditingModal onEditTodo={onEditTodo} selectedTodo={selectedTodo} setSelectedTodo={setSelectedTodo} setIsEditAlertShowed={setIsEditAlertShowed}/>
            
            {/* Deleting modal */}
            <DeletingModal onDeleteTodo={onDeleteTodo} selectedTodo={selectedTodo} setSelectedTodo={setSelectedTodo} setIsDeleteAlertShowed={setIsDeleteAlertShowed}/>
       
        </div>
    )
}