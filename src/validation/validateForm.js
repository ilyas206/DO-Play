export const validateForm = (label, details, date, time, tag, priority, setErrors) => {
    setErrors({})
    
    const labelValue = label.current.value
    const detailsValue = details.current.value
    const tagValue = tag.current.value
    const priorityValue = priority.current.value
    const dateValue = date.current.value
    const timeValue = time.current.value

    let isFormValid = true

    // Title validation

    const maxLabelLength = 25

    if(labelValue.trim() === ''){
        setErrors(prevState => {
            return {...prevState, 
            ...{label : "Field required"}}
        })
        isFormValid = false
    }else if(maxLabelLength <= labelValue.length) {
        setErrors(prevState => {
            return {...prevState, 
            ...{label : `Too long ! Label should be less than ${maxLabelLength} characters`}}
        })
        isFormValid = false
    }

    // Details validation

    const minDetailsLength = 25
    const maxDetailsLength = 120
    const currentDetailsLength = detailsValue.length
    
    if(detailsValue.trim() === ''){
        setErrors(prevState => {
            return {...prevState, 
            ...{details : "Field required"}}
        })
        isFormValid = false
    }else if(minDetailsLength > currentDetailsLength){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{details : `Too short ! Details should be greater than ${minDetailsLength} characters (${currentDetailsLength} / ${minDetailsLength})`}
            }
        })
        isFormValid = false
    }else if(maxDetailsLength <= currentDetailsLength ){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{details : `Too long ! Details should be less than ${maxDetailsLength} characters`}
            }
        })
        isFormValid = false
    }

    // Tag validation

    if(tagValue === ''){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{tag : "A tag should be selected"}
            }
        })
        isFormValid = false
    }

    // Priority validation 

    if(priorityValue === ''){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{priority : "A priority should be selected"}
            }
        })
        isFormValid = false
    }

    // Date validation

    if(dateValue.trim() === ''){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{date : "Date should be specified"}
            }
        })
        isFormValid = false
    }else {
        const selectedDate = new Date(dateValue)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if(isNaN(selectedDate.getTime())){
            setErrors(prevState => {
                return {
                    ...prevState,
                    ...{date : "Invalid date format"}
                }
            })
            isFormValid = false
        }else if(selectedDate < today) {
            setErrors(prevState => {
                return {
                    ...prevState,
                    ...{date : "Date cannot be in the past"}
                }
            })
            isFormValid = false
        }
    }

    // Time validation

    if(timeValue.trim() === ''){
        setErrors(prevState => {
            return {
                ...prevState,
                ...{time : "Time should be specified"}
            }
        })
        isFormValid = false
    }else {
        // get current hours/minutes
        const now = new Date()
        const currentHours = now.getHours()
        const currentMinutes = now.getMinutes()

        // normalize selected date (remove time part)
        const selectedDate = new Date(dateValue)
        selectedDate.setHours(0, 0, 0, 0)

        // if selected date is today, ensure selected time is in the future
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // parse timeValue "HH:MM"
        const [selH, selM] = timeValue.split(':').map(v => Number(v))

        if (selectedDate.getTime() === today.getTime()) {
            if (isNaN(selH) || isNaN(selM)) {
                setErrors(prevState => ({ ...prevState, time: "Invalid time format" }))
                isFormValid = false
            } else if (selH < currentHours || (selH === currentHours && selM <= currentMinutes)) {
                setErrors(prevState => ({ ...prevState, time: "Time cannot be in the past" }))
                isFormValid = false
            }
        }
    }
    
    return isFormValid
}