import { Box, Button } from "@mui/material";
import { DANGER_COLOR } from "../style";
import { handleTagColor, handleTagIcon } from "../tags";

export default function DeletingModal({selectedTodo, onConfirmDelete}) {

    const viewDeletingTodo = () => {
        const newDate = new Date(selectedTodo.date)
        const day = newDate.getDate().toString()
        const month = newDate.toLocaleDateString("en-GB", { month: "short" })
        const year = newDate.getFullYear().toString()

        let [hours, minutes] = selectedTodo.time.split(":");

        if(selectedTodo){
            return <div className="modal-body">
                <div className="d-flex align-items-center justify-content-between fw-light">
                    <p><span className="display-6">{hours}</span> : {minutes}</p>
                    <p><span className="display-6">{day} {month}</span> {year}</p>
                </div>
                <hr />
                <div className="d-flex align-items-center gap-3">
                    <h3 className="fw-light display-6">{selectedTodo.label}</h3>
                    <Box
                        sx={{
                            color : handleTagColor(selectedTodo.tag),
                            padding : "6px 8px",
                            border : `1px solid ${handleTagColor(selectedTodo.tag)}`,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width : "fit-content",
                            '& svg' : {
                                fontSize : '17px'
                            }
                        }}
                        >
                        {handleTagIcon(selectedTodo.tag)}
                    </Box>
                </div>
                <p className="fw-light text-muted">{selectedTodo.details}</p>
            </div> 
        }return <div className="modal-body">
                <p className="fw-10">No Todo selected</p>
            </div>
    }

    return(
        <div
            className="modal fade"
            id="deleteModal"
            tabIndex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                    Confirm deleting Todo
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
                </div>

                {selectedTodo && viewDeletingTodo()}

                <div className="modal-footer d-flex justify-content-between">
                    {
                        !selectedTodo?.done && <span style={{color : DANGER_COLOR}}>
                            This todo is undone !
                        </span>
                    }
                    <div className="d-flex align-items-center gap-2 ms-auto">
                        <Button 
                            type="button" 
                            variant="outlined" 
                            sx={{
                                borderColor: DANGER_COLOR, 
                                borderRadius : "10px",   
                                color: DANGER_COLOR,
                            }} 
                            onClick={onConfirmDelete}
                            data-bs-dismiss="modal">
                            {!selectedTodo?.done ? "Delete anyway" : "Delete"}
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
                </div>
            </div>
            </div>
        </div>
    )
}