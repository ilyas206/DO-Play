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
        case 'Home' : return "#C27A52"
        case 'Health' : return "#3F9B67"
        case 'Sport' : return "#C74343"
        case 'Shopping' : return "#C0A243"
        default : return "#757D79"
    }
}

export const handleTagIcon = tag => {
    switch(tag) {
        case 'Personal' : return <PersonIcon/>
        case 'Work' : return <WorkIcon/>
        case 'Home' : return <HomeIcon/>
        case 'Health' : return <HealthAndSafetyIcon/>
        case 'Sport' : return <FitnessCenterIcon/>
        case 'Other' : return <MoreHorizIcon/>
        default : return <ShoppingCartIcon/>
    }
}