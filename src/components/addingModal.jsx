import { useEffect, useRef, useState } from "react";
import { DANGER_COLOR, MAIN_COLOR } from "../style";
import { Button } from "@mui/material";
import { validateForm } from "../validation/validateForm";

export default function AddingModal({onAddTodo, setIsAddAlertShowed, theme}) {
    
    const [currentId, setCurrentId] = useState(21)
    const [errors, setErrors] = useState({})
    const [isAddFormValid, setIsAddFormValid] = useState(false)

    const label = useRef()
    const details = useRef()
    const tag = useRef()
    const priority = useRef()
    const date = useRef()
    const time = useRef()

    useEffect(() => {
        const modalElement = document.getElementById("addModal")
        modalElement.addEventListener("show.bs.modal", resetForm) 
        if(!modalElement) return 

        return () => {
            modalElement.removeEventListener("show.bs.modal", resetForm)
        }
    },[])

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

    const displayTagSelect = () => {
        return(
            <>
                <select className={`form-select shadow-none ${errors['tag'] ? 'red-input-border' : 'green-input-border'}`} ref={tag}>
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

    const displayPrioritySelect = () => {
        return(
            <>
                <select className={`form-select shadow-none ${errors['priority'] ? 'red-input-border' : 'green-input-border'}`} ref={priority}>
                    <option value="">Select a Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                {errors['priority'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['priority']}</div>}
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

    const resetForm = () => {
        label.current.value = ''
        details.current.value = ''
        date.current.value = ''
        tag.current.value = ''
        priority.current.value = ''
        time.current.value = ''
        setErrors({})
    }

    const handleAddChange = () => {
        const isValid = validateForm(label, details, date, time, tag, priority, setErrors)
        setIsAddFormValid(isValid)
    }

    const handleConfirmAdd = e => {
        e.preventDefault()
        const isValid = validateForm(label, details, date, time, tag, priority, setErrors)
        setIsAddFormValid(isValid)

        if(isValid){
            setIsAddAlertShowed(true)
            setIsAddFormValid(false)
            onAddTodo({
                id : currentId,
                label : label.current.value,
                details : details.current.value,
                tag : tag.current.value,
                priority : priority.current.value,
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

    return(
        <>
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
                            <label className="my-1">Priority</label>
                            {displayPrioritySelect()}
                            <label className="my-1">Date</label>
                            {displayOtherInputs('date')}
                            <label className="my-1">Time ( Started at )</label>
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
        </>
    )
}