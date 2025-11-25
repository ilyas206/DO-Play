import { Box, Button } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function DeletingModal({selectedTodo, onConfirmDelete}) {

    const handleTagColor = tag => {
        switch(tag) {
            case 'Personal' : return "#F7BFBF"
            case 'Work' : return "#A8C9F0"
            case 'Home' : return "#F3E7B3"
            case 'Health' : return "#B8F2C5"
            case 'Other' : return "#c9cfcbff"
            default : return "#D5C7F7"
        }
    }

    const handleTagIcon = tag => {
        switch(tag) {
            case 'Personal' : return <PersonIcon />
            case 'Work' : return <WorkIcon />
            case 'Home' : return <HomeIcon />
            case 'Health' : return <MonitorHeartIcon/>
            case 'Other' : return <MoreHorizIcon/>
            default : return <ShoppingCartIcon/>
        }
    }

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
                        !selectedTodo?.done && <span style={{color : "#ea7c7cff"}}>
                            This todo is undone !
                        </span>
                    }
                    <div className="d-flex align-items-center gap-2 ms-auto">
                        <Button 
                            type="button" 
                            variant="outlined" 
                            sx={{
                                borderColor: "#ea7c7cff", 
                                borderRadius : "10px",   
                                color: "#ea7c7cff",
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