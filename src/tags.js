import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export const handleTagColor = tag => {
    switch(tag) {
        case 'Personal' : return "#A3568A"
        case 'Work' : return "#3D6FA8"
        case 'Home' : return "#c29352ff"
        case 'Health' : return "#3F9B67"
        case 'Sport' : return "#4347c7ff"
        case 'Shopping' : return "#adc043ff"
        default : return "#757D79"
    }
}

export const handleTagIcon = tag => {
    switch(tag) {
        case 'Personal' : return <PersonIcon fontSize='small'/>
        case 'Work' : return <WorkIcon fontSize='small'/>
        case 'Home' : return <HomeIcon fontSize='small'/>
        case 'Health' : return <HealthAndSafetyIcon fontSize='small'/>
        case 'Sport' : return <FitnessCenterIcon fontSize='small'/>
        case 'Other' : return <MoreHorizIcon fontSize='small'/>
        default : return <ShoppingCartIcon fontSize='small'/>
    }
}