const {BrowserWindow} = require('electron')

const path = require('path')

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
}
function send(channel,...args){
    win.webContents.send(channel,...args)
}
function closeWindow(){
    win.close()
}
module.exports = {createWindow,send,closeWindow}
