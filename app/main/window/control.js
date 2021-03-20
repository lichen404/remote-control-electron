const {BrowserWindow} = require('electron')
const {send:send2MainWindow} = require('./main')
const path = require('path')
const {signal} = require("../singal");

let win
function createWindow() {
    win = new BrowserWindow(
        {
            minWidth: 1366,
            minHeight: 768,
            webPreferences: {
                nodeIntegration: true,

            },
            show:false
        }
    )
    win.webContents.openDevTools()
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html')).then()
    win.on('ready-to-show',()=>{
        win.show()
    })
    win.on('close',()=>{
        send2MainWindow('control-state-change', {status: 'cancel-control'})
        signal.send && signal.send('cancel-control', '')
    })
}
function send(channel,...args){
    win.webContents.send(channel,...args)
}
function closeWindow(){
    win.close()
}
module.exports = {createWindow,send,closeWindow}
