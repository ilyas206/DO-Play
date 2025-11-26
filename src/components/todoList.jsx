import { useEffect, useRef, useState, useCallback } from "react";
import { Modal } from 'bootstrap';
import { validateForm } from "../validation/validateForm";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { Box, Button, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import "../todoList.css";
import DeletingModal from "./deletingModal";
import { DANGER_COLOR, MAIN_COLOR, SECOND_COLOR } from "../style";
import { handleTagColor, handleTagIcon } from "../tags";

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
            backgroundColor: SECOND_COLOR,
            opacity: 1,
            border: 0,
            ...theme.applyStyles('dark', {
            backgroundColor: SECOND_COLOR,
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
        },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: SECOND_COLOR,
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

export default function TodoList({todos, onToggleTodo, onAddTodo, onDeleteTodo, onEditTodo,setSearch, setFilter, filter}) {

    const [selectedTodo, setSelectedTodo] = useState(null)
    const [errors, setErrors] = useState({})
    const [isAddAlertShowed, setIsAddAlertShowed] = useState(false)
    const [isEditAlertShowed, setIsEditAlertShowed] = useState(false)
    const [isDeleteAlertShowed, setIsDeleteAlertShowed] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())

    const [isAddFormValid, setIsAddFormValid] = useState(false)
    const [isEditFormValid, setIsEditFormValid] = useState(true)
    const [currentId, setCurrentId] = useState(21)
    
    useEffect(() => {
        const id = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => clearInterval(id)
    }, [])

    const label = useRef()
    const details = useRef()
    const tag = useRef()
    const date = useRef()
    const time = useRef()

    const searchRef = useRef()
    const filterRef = useRef()

    const uLabel = useRef()
    const uDetails = useRef()
    const uTag = useRef()
    const uDate = useRef()
    const uTime = useRef()

    const displayTextInput = () => {
        return(
            <>
                <input type="text" 
                className={`form-control mt-1 shadow-none ${errors['label'] ? 'red-input-border' : 'green-input-border'}`} 
                ref={label}
                />
                {errors['label'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['label']}</div>}
            </>
        )
    }

    const displayTagSelect = () => {
        return(
            <>
                <select className={`form-select mt-1 shadow-none ${errors['tag'] ? 'red-input-border' : 'green-input-border'}`} ref={tag}>
                    <option value="">Select a Tag</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Home">Home</option>
                    <option value="Health">Health</option>
                    <option value="Sport">Sport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other...</option>
                </select>

                {errors['tag'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['tag']}</div>}
            </>
        )
    }

    const displayTextAreaInput = () => {
        return(
            <>
                <textarea
                className={`form-control mt-1 shadow-none ${errors['details'] ? 'red-input-border' : 'green-input-border'}`} 
                ref={details}
                ></textarea>
                {errors['details'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['details']}</div>}
            </>
        )
    }

    const displayOtherInputs = fieldName => {
        return(
            <>
                <input type={fieldName}
                className={`form-control mt-1 shadow-none ${errors[fieldName] ? 'red-input-border' : 'green-input-border'}`} 
                ref={fieldName === 'date' ? date : time}
                />
                {errors[fieldName] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors[fieldName]}</div>}
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
        tag.current.value = ''
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
                <td>{todo.label}</td>
                <td><b>{day} {month}{currentYear !== year && ` - ${year}`}</b></td>
                <td>{hours} <b>:</b> {minutes}</td>
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

    const handleAddChange = selectedOptionOrEvent => {
        const isValid = validateForm(label, details, date, time, tag, setErrors)
        setIsAddFormValid(isValid)
    }

    const handleEditChange = () => {
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, uTag, setErrors)
        setIsEditFormValid(isValid)
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

    const viewingTodo = useCallback(() => {
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
    }, [selectedTodo])

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
                                    border : `1px solid ${MAIN_COLOR}`,
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx : 2
                                }}
                                >
                                <CheckIcon sx={{ fontSize : "1.7rem", color : MAIN_COLOR }}/>
                                <b style={{color : MAIN_COLOR}}>Done</b>
                            </Box>
                            : <Box
                                sx={{
                                    color : "#1e1f24ff",
                                    padding: "6px",
                                    border : `1px solid ${DANGER_COLOR}`,
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx : 2
                                }}
                                >
                                <CloseIcon sx={{ fontSize : "1.7rem", color : DANGER_COLOR }}/>
                                <b style={{color : DANGER_COLOR}}>Undone</b>
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
                                        borderColor: MAIN_COLOR,    
                                        borderRadius : "10px",
                                        color: MAIN_COLOR,
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
                            className={`form-control mt-2 shadow-none ${errors.label ? 'red-input-border' : 'blue-input-border'}`} 
                            ref={uLabel}/>

                            {errors.label && <div style={{color : DANGER_COLOR}} className="mb-2">{errors.label}</div>}

                            Details 
                            <textarea 
                            value={selectedTodo?.details} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, details : e.target.value})} 
                            className={`form-control mt-2 shadow-none ${errors.details ? 'red-input-border' : 'blue-input-border'}`} 
                            ref={uDetails}></textarea>

                            {errors.details && <div style={{color : DANGER_COLOR}} className="mb-2">{errors.details}</div>}

                            <label className="my-1">Tag</label>

                            <select 
                                className={`form-select mt-1 shadow-none ${errors['tag'] ? 'red-input-border' : 'blue-input-border'}`} 
                                ref={uTag} 
                                value={selectedTodo?.tag} 
                                onChange={e => setSelectedTodo({...selectedTodo, tag : e.target.value})}>
                                <option value="">Select a Tag</option>
                                <option value="Personal">Personal</option>
                                <option value="Work">Work</option>
                                <option value="Home">Home</option>
                                <option value="Health">Health</option>
                                <option value="Sport">Sport</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Other">Other...</option>
                            </select>

                            {errors.tag && <div style={{color : DANGER_COLOR}} className="mb-2">{errors.tag}</div>}

                            Date 
                            <input type="date" 
                            value={selectedTodo?.date} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, date : e.target.value})} 
                            className={`form-control mt-2 shadow-none ${errors.date ? 'red-input-border' : 'blue-input-border'}`} 
                            ref={uDate}/>

                            {errors.date && <div style={{color : DANGER_COLOR}} className="mb-2">{errors.date}</div>}

                            Time 
                            <input type="time" 
                            value={selectedTodo?.time} 
                            onChange={(e) => setSelectedTodo({...selectedTodo, time : e.target.value})} 
                            className={`form-control mt-2 shadow-none ${errors.time ? 'red-input-border' : 'blue-input-border'}`} 
                            ref={uTime}/>

                            {errors.time && <div style={{color : DANGER_COLOR}} className="mb-2">{errors.time}</div>}

                            <div className="d-flex align-items-center gap-2 mt-3 ms-auto">
                            <Button 
                                type="submit" 
                                variant="outlined" 
                                sx={{
                                    borderColor: SECOND_COLOR,  
                                    borderRadius : "10px",  
                                    color: SECOND_COLOR,
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