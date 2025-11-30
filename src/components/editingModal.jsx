import { DANGER_COLOR, SECOND_COLOR } from "../style";
import { useEffect, useRef, useState } from "react";
import { validateForm } from "../validation/validateForm";
import { Button } from "@mui/material";

export default function EditingModal({onEditTodo, selectedTodo, setSelectedTodo, setIsEditAlertShowed}) {

    const [isEditFormValid, setIsEditFormValid] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        const modalElement = document.getElementById("editModal")
        modalElement.addEventListener("show.bs.modal", resetErrors)  
        if(!modalElement) return

        return () => {
            modalElement.removeEventListener("show.bs.modal", resetErrors)
        }
    },[])

    const uLabel = useRef()
    const uDetails = useRef()
    const uTag = useRef()
    const uDate = useRef()
    const uTime = useRef()

    const resetErrors = () => {
        setErrors({})
    }

    const displayTextInput = () => {
        return <>  
            <input type="text" 
            value={selectedTodo?.label} 
            onChange={(e) => setSelectedTodo({...selectedTodo, label : e.target.value})} 
            className={`form-control mt-1 shadow-none ${errors['label'] ? 'red-input-border' : 'blue-input-border'}`} 
            ref={uLabel}/>

            {errors['label'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['label']}</div>}
        </>
    }

    const displayTextAreaInput = () => {
        return <>
            <textarea 
            value={selectedTodo?.details} 
            onChange={(e) => setSelectedTodo({...selectedTodo, details : e.target.value})} 
            className={`form-control mt-1 shadow-none ${errors['details'] ? 'red-input-border' : 'blue-input-border'}`} 
            ref={uDetails}></textarea>

            {errors['details'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['details']}</div>}
        </>
    }

    const displayTagSelect = () => {
        return <>
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

            {errors['tag'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['tag']}</div>}
        </>
    }

    const displayDateInput = () => {
        return <>
            <input type="date" 
            value={selectedTodo?.date} 
            onChange={(e) => setSelectedTodo({...selectedTodo, date : e.target.value})} 
            className={`form-control mt-1 shadow-none ${errors['date'] ? 'red-input-border' : 'blue-input-border'}`} 
            ref={uDate}/>

            {errors['date'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['date']}</div>}
        </>
    }

    const displayTimeInput = () => {
        return <>
            <input type="time"
            value={selectedTodo?.time} 
            onChange={(e) => setSelectedTodo({...selectedTodo, time : e.target.value})} 
            className={`form-control mt-1 shadow-none ${errors['time'] ? 'red-input-border' : 'blue-input-border'}`} 
            ref={uTime}/>

            {errors['time'] && <div style={{color : DANGER_COLOR}} className="mb-2">{errors['time']}</div>}
        </>
    }

    // If i want to edit a Todo current datetime to a future datetime , it should be undone
    const handleEditingToFutureDates = () => {
        const currentDate = new Date()
        const todoDate = new Date(selectedTodo?.date)
        const [hStr, mStr] = (selectedTodo?.time || "00:00").split(":")
        const hours = parseInt(hStr, 10) || 0
        const minutes = parseInt(mStr, 10) || 0
        const scheduled = new Date(todoDate)
        scheduled.setHours(hours, minutes, 0, 0)

        return scheduled.getTime() >= currentDate.getTime()
    }

    const handleEditChange = () => {
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, uTag, setErrors)
        setIsEditFormValid(isValid)
    }

    const handleConfirmEdit = e => {
        e.preventDefault()
        const isValid = validateForm(uLabel, uDetails, uDate, uTime, uTag, setErrors)
        setIsEditFormValid(isValid)

        if(selectedTodo && isValid) {

            const willBeDone = handleEditingToFutureDates() && false

            onEditTodo({
                ...selectedTodo,
                label : uLabel.current.value,
                details : uDetails.current.value,
                done : willBeDone,
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
                        <h5 className="modal-title" id="editModalLabel">
                            Edit Todo
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form className="d-flex flex-column" onSubmit={handleConfirmEdit} onChange={handleEditChange}>
                            <label className="my-1">Label</label> 
                            {displayTextInput()}
                            <label className="my-1">Details</label> 
                            {displayTextAreaInput()}
                            <label className="my-1">Tag</label>
                            {displayTagSelect()}       
                            <label className="my-1">Date</label> 
                            {displayDateInput()}
                            <label className="my-1">Time ( Started at )</label>
                            {displayTimeInput()}
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