const {BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let win
let willQuitApp = false
function createWindow() {
    win = new BrowserWindow(
        {
            width: 600,
            height: 300,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule:true,

            }
        }
    )
    win.webContents.openDevTools()
    win.on('close',(e)=>{
        if(willQuitApp){
            win = null
        }else {
            e.preventDefault()
            win.hide()
        }

    })
    if (isDev) {
        win.loadURL('http://localhost:3000').then()
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html')).then()
    }
}
function send(channel,...args){
    win.webContents.send(channel,...args)
}
function closeMainWindow(){
    willQuitApp = true
    win.close()
}
function  showMainWindow(){
    win.show()
}
module.exports = {createWindow,send,showMainWindow,closeMainWindow}
