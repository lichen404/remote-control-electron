import React,{useState}from 'react'
import TextField from "@material-ui/core/TextField";
export  default  function (props){
    const [firstFocusFlag,setFirstFocusFlag] = useState(false)
    const handleChange = (e)=>{
        const value = e.target.value
        if(value.match(props.rule)){
            setFirstFocusFlag(false)
        }
        props.setValue(value)
    }
    return (
        <TextField
            error={firstFocusFlag && !props.value.match(props.rule)}
            label={props.label}
            value={props.value}
            onChange={(e) => handleChange(e)}
            helperText={props.helperText}
            variant="filled"
            onFocus={()=>setFirstFocusFlag(true)}
        />
    )
}