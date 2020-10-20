const {ipcMain} = require('electron')
const {send:sendMainWindow} = require('./window/main')
const {createWindow:createControlWindow} = require('./window/control')
module.exports = function () {
    ipcMain.handle('login',async ()=>{
        //mock
        return Math.floor(Math.random() * (999999 - 100000)) + 100000
    })
    ipcMain.on('control',async (e,remoteCode)=>{
        //mock
        sendMainWindow('control-state-change',remoteCode,1 )
        createControlWindow()
    })
}