import { Box, Button } from "@mui/material";
import { DANGER_COLOR, MAIN_COLOR } from "../style";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback } from "react";
import { handleTagColor, handleTagIcon } from "../tags";

export default function ViewingModal({selectedTodo}) {

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
        <>
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
        </>
    )
}