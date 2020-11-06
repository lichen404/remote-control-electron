import React from "react";
import Button from "@material-ui/core/Button";
import {withStyles} from '@material-ui/core/styles';
const CancelButton = withStyles({
    root: {
        backgroundColor: '#0a8eee',
        marginTop:'20px',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#0a8eee',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0a8eee',

        },
        '&:focus': {
            boxShadow: '0 0 0 0.1rem rgba(0,123,255,.5)',
        },
    }
})(Button)
export default function (props) {
    return (
        <>
            <div>{props.text}</div>
            <CancelButton variant="contained" onClick={()=>props.cancelControl()}>取消控制</CancelButton>
        </>


    )
}
