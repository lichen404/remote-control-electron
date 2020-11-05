import React, {useState, useEffect} from 'react';
import './App.css';
import './peer-puppet'
import {ipcRenderer,remote} from 'electron'

const {Menu,MenuItem} = remote
function App() {
    const [data, setData] = useState({
        code:"",
        ip:""
    })
    const [controlText, setControlText] = useState('')
    const [remoteIp,setRemoteIp] = useState('')
    const [remoteCode,setRemoteCode] = useState('')
    const login = async () => {
        // let data = await ipcRenderer.invoke('init')
        setData(data)
    }

    useEffect(() => {
        login().then()
        ipcRenderer.on('control-state-change', handleControlState)
        return () => {
            ipcRenderer.removeListener('control-state-change', handleControlState)
        }
    }, [])
    const startControl = (payload) => {
        ipcRenderer.send('control', payload)
    }
    const handleControlState = (e, payload) => {
        let text = ''
        switch (payload.status){
            case 'loading':
                text = 'loading';
                break;
            case 'loading-close':
                text = '';
                break;
            case 'be-controlled':
                text=`被${payload.data}控制中`;
                break;
            case 'controlled':
                text=`正在远程控制${payload.data}`;
                break;
            default:
                console.error('unknown status')
                text = ''
                break;

        }
        setControlText(text)
    }
    const handleContextMenu = (e) => {
        e.preventDefault()
        const menu = new Menu()
        menu.append(new MenuItem({label: "复制", role: 'copy'}))
        menu.popup()
    }
    return (
        <div className="container">
            {
                controlText === '' ? <>
                    <div className='localData'>
                        <div>你的控制码 <span onContextMenu={(e) => handleContextMenu(e)}>{data.code}</span></div>
                        <div>你的本地IP <span>{data.ip}</span></div>
                    </div>
                    <div className="divider"/>
                    <div className='userForm'>

                        <input type="text" value={remoteCode} onChange={e => setRemoteCode(e.target.value)}/>
                        <input type="text" value={remoteIp} onChange={e => setRemoteIp(e.target.value)}/>
                        <button onClick={() => {
                            startControl({remoteCode,remoteIp})
                        }
                        }>确认
                        </button>
                    </div>

                </> : <div>{controlText}</div>
            }
        </div>
    );
}

export default App;
