import React,{useState,useEffect} from "react";
import {ipcRenderer,remote} from 'electron'


const {Menu,MenuItem} = remote
const handleContextMenu = (e) => {
    e.preventDefault()
    const menu = new Menu()
    menu.append(new MenuItem({label: "复制", role: 'copy'}))
    menu.popup()
}
function LocalDataView() {
    const [data, setData] = useState({
        code:"",
        ip:""
    })
    const login = async () => {
        let data = await ipcRenderer.invoke('init')
        setData(data)
    }
    useEffect(() => {
        login().then()

    }, [])
    return (
        <div className='localData'>
            <div className="wrapper">
                <div className="label">
                    <div>您的IP </div>
                    <span className="code" onContextMenu={(e) => handleContextMenu(e)}>{data.ip || 'loading'} </span>
                </div>
                <div className="label">
                    <div>您的控制码 </div>
                    <span  className="code" onContextMenu={(e) => handleContextMenu(e)}>{data.code || 'loading'}</span>
                </div>

            </div>


        </div>
    )
}
export  default  LocalDataView
