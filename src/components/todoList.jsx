import { useEffect, useRef, useState } from "react";
import { Modal } from 'bootstrap';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { Box, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import "../todoList.css";
import DeletingModal from "./deletingModal";
import { DANGER_COLOR, MAIN_COLOR, SECOND_COLOR } from "../style";
import { handleTagColor, handleTagIcon } from "../tags";
import Scroller from "./scroller";
import AddingModal from "./addingModal";
import EditingModal from "./editingModal";
import ViewingModal from "./viewingModal";

export default function TodoList({todos, onToggleTodo, onAddTodo, onDeleteTodo, onEditTodo, setSearch, setFilter, filter}) {

    const [selectedTodo, setSelectedTodo] = useState(null)
    const [errors, setErrors] = useState({})
    const [isAddAlertShowed, setIsAddAlertShowed] = useState(false)
    const [isEditAlertShowed, setIsEditAlertShowed] = useState(false)
    const [isDeleteAlertShowed, setIsDeleteAlertShowed] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    
    useEffect(() => {
        const id = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => clearInterval(id)
    }, [])

    const searchRef = useRef()
    const filterRef = useRef()

    const handleAddClick = () => {
        setErrors({})
        const modal = new Modal(document.getElementById("addModal"))
        modal.show()
    }

    const handleDeleteClick = todo => {
        setSelectedTodo(todo);
        const modal = new Modal(document.getElementById("deleteModal"));
        modal.show();
    };

    const handleEditClick = todo => {
        setErrors({})
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("editModal"))
        modal.show()
    }

    const handleViewClick = todo => {
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("viewModal"))
        modal.show()
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
            const pastClass = isPast ? "text-muted" : "fw-bold"

            let rowStyle
            let checkBoxId
            if(todo.done && isPast){
                rowStyle = "text-center past-done-row"
                checkBoxId = `past-cbx-${todo.id}`
            }else if(todo.done && !isPast){
                rowStyle = "text-center done-row"
                checkBoxId = `cbx-${todo.id}`
            }else{
                rowStyle = "text-center"
                checkBoxId = `cbx-${todo.id}`
            }
 
            const deleteIconColor = todo.done ? DANGER_COLOR : "#9e9e9eff"
 
            return <tr key={todo.id} onClick={() => handleViewClick(todo)} className={rowStyle}>
                <td className="d-flex align-items-center justify-content-center">
                    <input type="checkbox" 
                    className="hidden-xs-up"
                    id={checkBoxId}
                    checked={todo.done} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {onToggleTodo(todo.id); e.stopPropagation()}}/>
                    <label htmlFor={checkBoxId} className="cbx" onClick={(e) => e.stopPropagation()}></label>
                </td>
                <td className={pastClass}>{todo.label}</td>
                <td className={pastClass}>{day} {month}{currentYear !== year && ` - ${year}`}</td>
                <td className={pastClass}>{hStr} <b>:</b> {mStr}</td>
                <td>
                    <Box
                        sx={{
                            backgroundColor: handleTagColor(todo.tag),
                            color : "#1e1f24ff",
                            padding: "6px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        >
                        {handleTagIcon(todo.tag)}
                    </Box>
                </td>
                <td className="d-flex justify-content-center align-items-center gap-2">
                    <IconButton sx={{color : SECOND_COLOR, marginTop : "3px", marginBottom : "1px"}} onClick={(e) => {handleEditClick(todo); e.stopPropagation()}} aria-label="Edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{color : deleteIconColor, marginTop : "3px", marginBottom : "1px"}} onClick={(e) => {handleDeleteClick(todo); e.stopPropagation()}} aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
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
            <div className="card p-3 shadow" style={{backgroundColor : "#31363bff"}}>
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
                <IconButton sx={{ color: MAIN_COLOR }} onClick={handleSearch}>
                <SearchIcon />
                </IconButton>

                <IconButton sx={{ color: "#9e9e9eff" }} onClick={handleReset}>
                <RestartAltIcon />
                </IconButton>
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
                        icon={<CheckIcon fontSize="inherit"/>}
                        onClose={() => setIsAddAlertShowed(false)}
                        sx={{
                            mb : 1,
                            backgroundColor: MAIN_COLOR,    
                            color: "rgba(0,0,0,0.87)",      
                            '& .MuiAlert-icon': { color: 'inherit' } 
                        }}>
                        <b>You added a new Todo successfully</b>
                    </Alert>
                </Collapse>
                <Collapse in={isEditAlertShowed}>
                    <Alert
                        variant="filled"
                        icon={<DriveFileRenameOutlineIcon fontSize="inherit"/>}
                        onClose={() => setIsEditAlertShowed(false)}
                        sx={{
                            mb : 1, 
                            backgroundColor: SECOND_COLOR,
                            color: "rgba(0,0,0,0.87)",
                            '& .MuiAlert-icon': { color: 'inherit' }
                        }}>
                        <b>You edited the selected Todo successfully</b>
                    </Alert>
                </Collapse>
                <Collapse in={isDeleteAlertShowed}>
                    <Alert
                        variant="filled"
                        icon={<DangerousIcon fontSize="inherit"/>}
                        onClose={() => setIsDeleteAlertShowed(false)}
                        sx={{
                            mb : 1,
                            backgroundColor: DANGER_COLOR,
                            color: "rgba(0,0,0,0.87)",
                            '& .MuiAlert-icon': { color: 'inherit' }
                        }}>
                        <b>You deleted the selected Todo permanently</b>
                    </Alert>
                </Collapse>
            </div>
            {displayCurrentDate()}
            <div className="d-flex align-items-center justify-content-between mt-3">
                <h2 className="display-5"><span style={{color : MAIN_COLOR}}>TODO</span>Play</h2>
                <IconButton sx={{color : MAIN_COLOR}} onClick={handleAddClick} aria-label="Add">
                    <AddIcon fontSize="large" />
                </IconButton>
            </div>
            <hr/>
            {displaySearchBar()}
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th>Status</th>
                        <th>Label</th>
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
                            <td colSpan={6} align="center">
                                {filter === "Only done" ? "No done Todos yet" : "Your schedule is free"}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>

            {/* Viewing modal */}
            <ViewingModal selectedTodo={selectedTodo}/>

            {/* Adding modal */}
            <AddingModal onAddTodo={onAddTodo} errors={errors} setErrors={setErrors} setIsAddAlertShowed={setIsAddAlertShowed}/>

            {/* Editing modal */}
            <EditingModal onEditTodo={onEditTodo} errors={errors} setErrors={setErrors} selectedTodo={selectedTodo} setSelectedTodo={setSelectedTodo} setIsEditAlertShowed={setIsEditAlertShowed} />
            
            {/* Deleting modal */}
            <DeletingModal onDeleteTodo={onDeleteTodo} selectedTodo={selectedTodo} setSelectedTodo={setSelectedTodo} setIsDeleteAlertShowed={setIsDeleteAlertShowed}/>
       
        </div>
    )
}