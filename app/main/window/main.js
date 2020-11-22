const {BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const {signal} = require("../singal");


let win
let willQuitApp = false

function createWindow() {
    win = new BrowserWindow(
        {
            minWidth: 650,
            minHeight: 500,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
            },
            show:false,
            backgroundColor:'#FAFAFA'
        }
    )
    win.webContents.openDevTools()
    win.on('close', (e) => {
        if (willQuitApp) {
            win = null
        } else {
            e.preventDefault()
            win.hide()
        }

    })
    win.on('ready-to-show',()=>{
        win.show()
    })
    if (isDev) {
        win.loadURL('http://localhost:3000').then()
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html')).then()
    }
}

function send(channel, ...args) {
    win.webContents.send(channel, ...args)
}

function closeMainWindow() {
    willQuitApp = true
    signal.send && signal.send('cancel-control', '')
    win.close()

}

function showMainWindow() {
        win.show()

}

module.exports = {createWindow, send, showMainWindow, closeMainWindow}
