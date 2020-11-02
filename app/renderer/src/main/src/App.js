import React, {useState, useEffect} from 'react';
import './App.css';
import './peer-puppet'
import {ipcRenderer,remote} from 'electron'

const {Menu,MenuItem} = remote
function App() {
    const [remoteCode, setRemoteCode] = useState('')
    const [localCode, setLocalCode] = useState('')
    const [controlText, setControlText] = useState('')
    const [remoteIp,setRemoteIp] = useState('')
    const login = async () => {
        let code = await ipcRenderer.invoke('login')
        setLocalCode(code)
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
    const handleControlState = (e, name, type) => {
        let text = ''
        if (type === 1) {
            text = `正在远程控制${name}`
        } else if (type === 2) {
            text = `被${name}控制中`
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
        <div className="App">
            {
                controlText === '' ? <>
                    <div>你的控制码 <span onContextMenu={(e) => handleContextMenu(e)}>{localCode}</span></div>
                    <input type="text" value={remoteCode} onChange={e => setRemoteCode(e.target.value)}/>
                    <input type="text" value={remoteIp} onChange={e => setRemoteIp(e.target.value)}/>
                    <button onClick={() => {
                        startControl({remoteCode,remoteIp})
                    }
                    }>确认
                    </button>
                </> : <div>{controlText}</div>
            }
        </div>
    );
}

export default App;
