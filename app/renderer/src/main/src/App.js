import React, {useState, useEffect} from 'react';
import './App.css';
import './peer-puppet'
import {ipcRenderer} from 'electron'
import LocalDataView from './components/LocalDataView'
import InputForm from "./components/InputForm";
import ControlView from "./components/ControlView";
import TopBar from "./components/TopBar";

function App() {

    const [controlText, setControlText] = useState('')
    const [loadingStatus, setLoadingStatus] = useState(false)
    useEffect(() => {
        ipcRenderer.on('control-state-change', handleControlState)
        return () => {
            ipcRenderer.removeListener('control-state-change', handleControlState)
        }
    }, [])
    const cancelControl = ()=>{
        setControlText('')
        ipcRenderer.send('cancel-control')


    }
    const handleControlState = (e, payload) => {
        let text = ''
        switch (payload.status) {
            case 'loading':
                setLoadingStatus(true)
                break;
            case 'loading-close':
                text = '';
                setLoadingStatus(false)
                break;
            case 'be-controlled':
                text = `被${payload.data}控制中`;

                break;
            case 'controlled':
                text = `正在远程控制${payload.data}`;

                break;
            case 'cancel-control':
                text = ``
                break;
            default:
                console.error('unknown status')

                text = ''
                break;

        }
        if (text) {
            setControlText(text)
            setLoadingStatus(false)
        }

    }

    return (
        <div className="topWrapper">
            <TopBar/>
        <div className="container">

            <LocalDataView/>
            <div className="divider"/>
            <div className="userForm">
                {controlText === '' ?
                    <InputForm loadingStatus={loadingStatus} startLoading={() => setLoadingStatus(true)}/>
                    : <ControlView text={controlText} cancelControl={cancelControl}/>}
            </div>


        </div>
            </div>
    );
}

export default App;
