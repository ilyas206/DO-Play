import { useEffect, useRef, useState } from "react"
import { Modal } from 'bootstrap';
import { validateForm } from "../validation/validateForm";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import "../todoList.css";
import DeletingModal from "./deletingModal";

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
            backgroundColor: '#81e9ebff',
            opacity: 1,
            border: 0,
            ...theme.applyStyles('dark', {
            backgroundColor: '#81e9ebff',
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
        },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#81e9ebff',
        border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[600],
        }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
            opacity: 0.3,
        }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
        duration: 500,
        }),
        ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
        }),
    },
    }));

export default function TodoList({todos, onToggleTodo, onAddTodo, onDeleteTodo, onEditTodo, setFilter, filter}) {

    const [selectedTodo, setSelectedTodo] = useState(null)
    const [errors, setErrors] = useState({})
    const [isAddAlertShowed, setIsAddAlertShowed] = useState(false)
    const [isEditAlertShowed, setIsEditAlertShowed] = useState(false)
    const [isDeleteAlertShowed, setIsDeleteAlertShowed] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())

    const [isAddFormValid, setIsAddFormValid] = useState(false)
    const [isEditFormValid, setIsEditFormValid] = useState(true)
    const [currentId, setCurrentId] = useState(7)
    
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const id = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => clearInterval(id)
    }, [])

    const label = useRef()
    const details = useRef()
    const tag = useRef()
    const date = useRef()
    const time = useRef()


    const uLabel = useRef()
    const uDetails = useRef()
    const uTag = useRef()
    const uDate = useRef()
    const uTime = useRef()

    const displayTextInput = () => {
        return(
            <>
                <input type="text" 
                className={`form-control mt-1 ${errors['label'] ? 'border-danger' : ''}`} 
                ref={label}
                />
                {errors['label'] && <div className="text-danger mb-2">{errors['label']}</div>}
            </>
        )
    }

    const displayTagSelect = () => {
        return(
            <>
                <select className="form-select" ref={tag}>
                    <option value="">Select a Tag</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Home">Home</option>
                    <option value="Health">Health</option>
                    <option value="Shopping">Shopping</option>
                </select>

                {errors['tag'] && <div className="text-danger mb-2">{errors['tag']}</div>}
            </>
        )
    }

    const displayTextAreaInput = () => {
        return(
            <>
                <textarea
                className={`form-control mt-1 ${errors['details'] ? 'border-danger' : ''}`} 
                ref={details}
                ></textarea>
                {errors['details'] && <div className="text-danger mb-2">{errors['details']}</div>}
            </>
        )
    }

    const displayOtherInputs = fieldName => {
        return(
            <>
                <input type={fieldName === 'date' ? 'date' : 'time'}
                className={`form-control mt-1 ${errors[fieldName] ? 'border-danger' : ''}`} 
                ref={fieldName === 'date' ? date : time}
                />
                {errors[fieldName] && <div className="text-danger mb-2">{errors[fieldName]}</div>}
            </>
        )
    }

    const handleAddClick = () => {
        setErrors({})
        resetForm()
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
        setIsEditFormValid(false)
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("editModal"))
        modal.show()
    }

    const handleViewClick = todo => {
        setSelectedTodo(todo)
        const modal = new Modal(document.getElementById("viewModal"))
        modal.show()
    }

    const resetForm = () => {
        label.current.value = ''
        details.current.value = ''
        date.current.value = ''
        time.current.value = ''
    }

    const handleConfirmAdd = e => {
        e.preventDefault()
        const isValid = validateForm(label, details, date, time, tag, setErrors)
        setIsAddFormValid(isValid)

        if(isValid){
            setIsAddAlertShowed(true)
            setIsAddFormValid(false)
            onAddTodo({
                id : currentId,
                label : label.current.value,
                details : details.current.value,
                tag : tag.current.value,
                date : date.current.value,
                time : time.current.value
            })
            resetForm()
            setCurrentId(currentId => currentId + 1)

            setTimeout(() => {
                setIsAddAlertShowed(false)
            }, 5000)
        }
    }

    const handleConfirmDelete = () => {
        if (selectedTodo) {
            onDeleteTodo(selectedTodo.id);
            setSelectedTodo(null);
            setIsDeleteAlertShowed(true)

            setTimeout(() => {
                setIsDeleteAlertShowed(false)
            }, 5000)
        }
    };

    const handleConfirmEdit = e => {
        e.preventDefault()
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, uTag, setErrors)
        setIsEditFormValid(isValid)

        if(selectedTodo && isValid) {
            onEditTodo({
                ...selectedTodo,
                label : uLabel.current.value,
                details : uDetails.current.value,
                tag : uTag.current.value,
                date : uDate.current.value,
                time : uTime.current.value
            })
            setSelectedTodo(null)

            setIsEditAlertShowed(true)

            setTimeout(() => {
                setIsEditAlertShowed(false)
            }, 5000)
        }
    }

    const handleTagColor = tag => {
        switch(tag) {
            case 'Personal' : return "#F7BFBF"
            case 'Work' : return "#A8C9F0"
            case 'Home' : return "#F3E7B3"
            case 'Health' : return "#B8F2C5"
            default : return "#D5C7F7"
        }
    }

    // const handleTagColor = tag => {
    //     switch(tag) {
    //         case 'Personal' : return {backgroundColor : "#F7BFBF"}
    //         case 'Work' : return {backgroundColor : "#A8C9F0"}
    //         case 'Home' : return {backgroundColor : "#F3E7B3"}
    //         case 'Health' : return {backgroundColor : "#B8F2C5"}
    //         default : return {backgroundColor : "#D5C7F7"}
    //     }
    // }

    const handleTagIcon = tag => {
        switch(tag) {
            case 'Personal' : return <PersonIcon />
            case 'Work' : return <WorkIcon />
            case 'Home' : return <HomeIcon />
            case 'Health' : return <MonitorHeartIcon/>
            default : return <ShoppingCartIcon/>
        }
    }

    const displayTodos = () => {
        const currentYear = new Date().getFullYear().toString()
        return todos.map(todo => {
            const newDate = new Date(todo.date)
            const day = newDate.getDate().toString()
            const month = newDate.toLocaleDateString("en-GB", { month: "short" })
            const year = newDate.getFullYear().toString()
            let [hours, minutes] = todo.time.split(":")

            const rowStyle = `text-center ${todo.done ? 'done-row' : ''}`
            const checkBoxId = `cbx-${todo.id}`
            const deleteIconColor = todo.done ? "#ea7c7cff" : "#9e9e9eff"
            
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
                <td><b>{day} {month}{currentYear !== year && ` - ${year}`}</b></td>
                <td>{hours} <b>:</b> {minutes}</td>
                <td>{todo.label}</td>
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
                    <IconButton sx={{color : "#81e9ebff", marginTop : "3px", marginBottom : "1px"}} onClick={(e) => {handleEditClick(todo); e.stopPropagation()}} aria-label="Edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{color : deleteIconColor, marginTop : "3px", marginBottom : "1px"}} onClick={(e) => {handleDeleteClick(todo); e.stopPropagation()}} aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </td>   
            </tr>
        })
    }

    const handleAddChange = () => {
        const isValid = validateForm(label, details, date, time, tag, setErrors)
        setIsAddFormValid(isValid)
    }

    const handleEditChange = () => {
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, uTag, setErrors)
        setIsEditFormValid(isValid)
    }

    const handleHeaderClick = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
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

    const viewingTodo = () => {
        const viewDate = new Date(selectedTodo.date)
        const weekDay = viewDate.toLocaleDateString("en-GB", { weekday: "short" })
        const day = viewDate.getDate().toString()
        const month = viewDate.toLocaleDateString("en-GB", { month: "short" })
        const year = viewDate.getFullYear().toString().slice(2)

        let [hours, minutes] = selectedTodo.time.split(":");
        hours = String(parseInt(hours, 10));

        return( 
        <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <span className="display-6">{hours}</span>
                    <span> : {minutes}</span>
                </div>
                <div className="fw-light">
                    <span className="display-6">{weekDay} {day}</span>
                    <span> {month} {year}</span>
                </div>
            </div>
            <hr/>
                <div className="d-flex align-items-center gap-2">
                    <h2 className="fw-light">{selectedTodo.label}</h2>
                    <Box
                        sx={{
                            color : handleTagColor(selectedTodo?.tag),
                            padding : "3px 5px",
                            border : `1px solid ${handleTagColor(selectedTodo?.tag)}`,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap : "6px",
                            width : "fit-content",
                            '& svg' : {
                                fontSize : '17px'
                            }
                        }}
                        >
                        <b>{selectedTodo?.tag}</b>
                        {handleTagIcon(selectedTodo?.tag)}
                    </Box>
                </div>
                
            <p className="fw-light text-muted">{selectedTodo.details}</p>
        </div>)
    }

    return(
        <div className="container">
            <div className="my-2">
                <Collapse in={isAddAlertShowed}>
                    <Alert
                        variant="filled"
                        icon={<CheckIcon fontSize="inherit"/>}
                        onClose={() => setIsAddAlertShowed(false)}
                        sx={{
                            mb : 1,
                            backgroundColor: "#81eb8a",    
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
                            backgroundColor: "#81e9ebff",
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
                            backgroundColor: "#ea7c7cff",
                            color: "rgba(0,0,0,0.87)",
                            '& .MuiAlert-icon': { color: 'inherit' }
                        }}>
                        <b>You deleted the selected Todo permanently</b>
                    </Alert>
                </Collapse>
            </div>
            {displayCurrentDate()}
            <div className="d-flex align-items-center justify-content-between mt-3">
                <h2 className="display-5"><span className="title">TODO</span>Play</h2>
                <IconButton sx={{color : "#81eb8a"}} onClick={handleAddClick} aria-label="Add">
                    <AddIcon fontSize="large" />
                </IconButton>
            </div>
            <hr/>
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th onClick={handleHeaderClick} className="d-flex align-items-center mt-1 gap-2 justify-content-center done">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                            {filter}
                        </th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Label</th>
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
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                sx: {
                bgcolor: 'rgba(20,22,25,0.95)',
                color: 'rgba(230,238,246,1)',
                border: '1px solid rgba(255,255,255,0.06)',
                minWidth: 160
                }
            }}
            sx={{
                // ensure MenuItems inherit text color
                '& .MuiMenuItem-root': {
                color: 'inherit'
                }
            }}
            >
                <MenuItem 
                onClick={() => {
                    setFilter("All")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >All Todos
                </MenuItem>
                <MenuItem 
                onClick={() => {
                    setFilter("Only done")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >Only Done
                </MenuItem>
                <MenuItem 
                onClick={() => {
                    setFilter("Only undone")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >Only Undone
                </MenuItem>
                <MenuItem 
                onClick={() => {
                    setFilter("Work Todos")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >Work Todos
                </MenuItem>
                <MenuItem 
                onClick={() => {
                    setFilter("Personal Todos")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >Personal Todos
                </MenuItem>
                <MenuItem 
                onClick={() => {
                    setFilter("Home Todos")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >Home Todos
                </MenuItem>
                <MenuItem 
                onClick={() => {
                    setFilter("Health Todos")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >Health Todos
                </MenuItem>
                <MenuItem 
                onClick={() => {
                    setFilter("Shopping Todos")
                    handleClose()
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                >Shopping Todos
                </MenuItem>
            </Menu>

            {/* View modal */}
            <div
                className="modal fade"
                id="viewModal"
                tabIndex="-1"
                aria-labelledby="viewModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <h5 className="modal-title" id="viewModalLabel">
                        View Todo
                        </h5>
                        {
                            selectedTodo?.done 
                            ? <Box
                                sx={{
                                    color : "#1e1f24ff",
                                    padding: "6px",
                                    border : "1px solid #81eb8a",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx : 2
                                }}
                                >
                                <CheckIcon sx={{ fontSize : "1.7rem", color : "#81eb8a" }}/>
                                <b style={{color : "#81eb8a"}}>Done</b>
                            </Box>
                            : <Box
                                sx={{
                                    color : "#1e1f24ff",
                                    padding: "6px",
                                    border : "1px solid #ea7c7cff",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx : 2
                                }}
                                >
                                <CloseIcon sx={{ fontSize : "1.7rem", color : "#ea7c7cff" }}/>
                                <b style={{color : "#ea7c7cff"}}>Undone</b>
                            </Box>
                        }
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div> 
                    {
                        selectedTodo ? viewingTodo() : <div><h2 className="m-3">No selected Todo</h2></div>
                    }
                    <div className="modal-footer">
                        <Button 
                            type="button" 
                            variant="outlined" 
                            sx={{
                                borderColor: "#9e9e9eff",  
                                borderRadius : "10px",  
                                color: "#9e9e9eff"
                            }}
                            data-bs-dismiss="modal">
                            Return
                        </Button>
                    </div>
                </div>
                </div>
            </div>

            {/* Adding modal */}
            <div
                className="modal fade"
                id="addModal"
                tabIndex="-1"
                aria-labelledby="addModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="addModalLabel">
                        What's next ?
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div>
                    <div className="modal-body">
                        <form className="d-flex flex-column" onSubmit={handleConfirmAdd} onChange={handleAddChange}>
                            <label className="my-1">Label</label> 
                            {displayTextInput()}
                            <label className="my-1">Details</label>
                            {displayTextAreaInput()}
                            <label className="my-1">Tag</label>
                            {displayTagSelect()}
                            <label className="my-1">Date</label>
                            {displayOtherInputs('date')}
                            <label className="my-1">Time</label>
                            {displayOtherInputs('time')}
                            <div className="d-flex align-items-center gap-2 mt-3 ms-auto">
                                <Button 
                                    type="submit" 
                                    variant="outlined" 
                                    sx={{
                                        borderColor: "#81eb8a",    
                                        borderRadius : "10px",
                                        color: "#81eb8a",
                                    }} 
                                    disabled={!isAddFormValid} 
                                    data-bs-dismiss="modal">
                                    Add
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outlined" 
                                    sx={{
                                        borderColor: "#9e9e9eff", 
                                        borderRadius : "10px",   
                                        color: "#9e9e9eff"
                                    }}
                                    onClick={() => setIsAddFormValid(false)}
                                    data-bs-dismiss="modal">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>               
                </div>
                </div>
            </div>

            {/* Deleting modal */}
            <DeletingModal selectedTodo={selectedTodo} onConfirmDelete={handleConfirmDelete}/>

            {/* Editing modal */}
            <div
                className="modal fade"
                id="editModal"
                tabIndex="-1"
                aria-labelledby="editModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <h5 className="modal-title" id="editModalLabel">
                                Edit Todo
                            </h5>
                            <FormControlLabel
                                className="mx-3"
                                label={selectedTodo?.done ? "Done" : "Undone"}
                                labelPlacement="start"
                                control={<IOSSwitch sx={{ m: 1 }} checked={selectedTodo?.done} onChange={(e) => {setSelectedTodo({...selectedTodo, done : e.target.checked});handleEditChange()}} />}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form className="d-flex flex-column" onSubmit={handleConfirmEdit} onChange={handleEditChange}>
                            Label 
                            <input type="text" 
                            value={selectedTodo?.label} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, label : e.target.value})} 
                            className={`form-control mt-2 ${errors.label ? 'border-danger' : ''}`} 
                            ref={uLabel}/>

                            {errors.label && <div className="text-danger mb-2">{errors.label}</div>}

                            Details 
                            <textarea 
                            value={selectedTodo?.details} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, details : e.target.value})} 
                            className={`form-control mt-2 ${errors.details ? 'border-danger' : ''}`} 
                            ref={uDetails}></textarea>

                            {errors.details && <div className="text-danger mb-2">{errors.details}</div>}

                            <label className="my-1">Tag</label>

                            <select 
                                className="form-select" 
                                ref={uTag} 
                                value={selectedTodo?.tag} 
                                onChange={e => setSelectedTodo({...selectedTodo, tag : e.target.value})}>
                                <option value="">Select a Tag</option>
                                <option value="Personal">Personal</option>
                                <option value="Work">Work</option>
                                <option value="Home">Home</option>
                                <option value="Health">Health</option>
                                <option value="Shopping">Shopping</option>
                            </select>

                            {errors.tag && <div className="text-danger mb-2">{errors.tag}</div>}

                            Date 
                            <input type="date" 
                            value={selectedTodo?.date} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, date : e.target.value})} 
                            className={`form-control mt-2 ${errors.date ? 'border-danger' : ''}`} 
                            ref={uDate}/>

                            {errors.date && <div className="text-danger mb-2">{errors.date}</div>}

                            Time 
                            <input type="time" 
                            value={selectedTodo?.time} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, time : e.target.value})} 
                            className={`form-control mt-2 ${errors.time ? 'border-danger' : ''}`} 
                            ref={uTime}/>

                            {errors.time && <div className="text-danger mb-2">{errors.time}</div>}

                            <div className="d-flex align-items-center gap-2 mt-3 ms-auto">
                            <Button 
                                type="submit" 
                                variant="outlined" 
                                sx={{
                                    borderColor: "#81e9ebff",  
                                    borderRadius : "10px",  
                                    color: "#81e9ebff",
                                }} 
                                disabled={!isEditFormValid}
                                data-bs-dismiss="modal">
                                Edit
                            </Button>
                            <Button 
                                type="button" 
                                variant="outlined" 
                                sx={{
                                    borderColor: "#9e9e9eff",   
                                    borderRadius : "10px", 
                                    color: "#9e9e9eff"
                                }}
                                data-bs-dismiss="modal">
                                Cancel
                            </Button>
                        </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}