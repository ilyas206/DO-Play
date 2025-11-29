import { DANGER_COLOR, SECOND_COLOR } from "../style";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRef, useState } from "react";
import { validateForm } from "../validation/validateForm";
import { Button } from "@mui/material";


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

export default function EditingModal({onEditTodo, errors, setErrors, selectedTodo, setSelectedTodo, setIsEditAlertShowed}) {

    const [isEditFormValid, setIsEditFormValid] = useState(false)

    const uLabel = useRef()
    const uDetails = useRef()
    const uTag = useRef()
    const uDate = useRef()
    const uTime = useRef()

    const handleEditChange = () => {
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, uTag, setErrors)
        setIsEditFormValid(isValid)
    }

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
            setIsEditFormValid(false)
            setIsEditAlertShowed(true)
            setErrors({})

            setTimeout(() => {
                setIsEditAlertShowed(false)
            }, 5000)
        }
    }

    return(
        <>
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
        </>
    )
}