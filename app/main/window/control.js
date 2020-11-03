const {BrowserWindow} = require('electron')

const path = require('path')

let win
function createWindow() {
    win = new BrowserWindow(
        {
            width: 1000,
            height: 680,
            webPreferences: {
                nodeIntegration: true,

            }
        }
    )
    win.webContents.openDevTools()
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html')).then()

}
function send(channel,...args){
    win.webContents.send(channel,...args)
}
module.exports = {createWindow,send}
