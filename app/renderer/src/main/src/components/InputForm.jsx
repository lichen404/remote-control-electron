import React, {useState} from 'react';
import ConnectIcon from "./ConnectIcon";
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import {ipcRenderer} from 'electron'
import CircularProgress from '@material-ui/core/CircularProgress';
import {blue} from '@material-ui/core/colors';
import Input from "./Input";


const startControl = (payload) => {
    ipcRenderer.send('control', payload)
}
const useStyles = makeStyles((theme) => ({
    button: {
        width: '120px',
        padding: '10px 0'

    },
    buttonProgress: {
        color: blue[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));
const ConnectButton = withStyles({
    root: {
        backgroundColor: '#0a8eee',
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

function InputForm(props) {
    const classes = useStyles();
    const [remoteIp, setRemoteIp] = useState('')
    const [remoteCode, setRemoteCode] = useState('')

    const handleClick = () => {
        props.startLoading()
        startControl({remoteCode, remoteIp})

    }
    const validateForm = () => {
        return remoteIp.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) && remoteCode.match(/^\d{6}$/)
    }

    return (
        <form noValidate autoComplete="off">
            <Input rule={/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}
                   value={remoteIp} setValue={(value) => {
                setRemoteIp(value)
            }} helperText="请输入合法的IP地址" label='IP地址'/>
            <Input rule={/^\d{6}$/} value={remoteCode} setValue={(value)=>{
                setRemoteCode(value)
            }} helperText="注意:控制码为6位数字" label='控制码'/>

            <div className="buttonWrapper">
                <ConnectButton variant="contained" disabled={props.loadingStatus || !validateForm()}
                               startIcon={<ConnectIcon/>}
                               className={classes.button}
                               onClick={handleClick}>连接</ConnectButton>
                {props.loadingStatus && <CircularProgress size={24} className={classes.buttonProgress}/>}
            </div>
        </form>
    )
}

export default InputForm;


