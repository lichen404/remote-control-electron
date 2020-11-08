import React from "react";
import {ipcRenderer, shell} from 'electron'

export default function () {
    const triggerAboutWindow = () => {
        ipcRenderer.send('open-about-window')
    }
    const OpenUrlByDefaultBrowser = () => {
        shell.openExternal('https://github.com/lichen404/remote-control-electron/issues').then()
    }
    return (
        <ul className="topBar">
            <li onClick={triggerAboutWindow}>关于</li>
            <li onClick={OpenUrlByDefaultBrowser}>反馈</li>
        </ul>
    )
}
