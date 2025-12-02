export const handlePriorityColor = priority => {
    switch(priority) {
        case 'High' : return "rgb(184, 57, 57)"
        case 'Medium' : return "rgb(184, 116, 57)"
        default : return "rgb(184, 178, 57)"
    }
}