import {motion, useScroll} from "framer-motion"
import { MAIN_COLOR } from "../style"

export default function Scroller() {
    const {scrollYProgress} = useScroll()

    return(
        <motion.div 
            style={{
                scaleX : scrollYProgress, 
                backgroundColor : MAIN_COLOR, 
                position : 'fixed', 
                height : '5px',
                transformOrigin : 0, 
                top : 0, 
                left : 0, 
                right : 0,
                zIndex : 20
            }}>   
        </motion.div>
    )
}