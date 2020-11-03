const  {createWindow,showMainWindow,closeMainWindow} = require( "./window/main");
const {app} = require('electron')
const handleIPC = require('./ipc')


const gotTheLock = app.requestSingleInstanceLock()
//判断是否多开
if(!gotTheLock){
    app.quit()
}
else {

    app.on('second-instance',()=>{
        showMainWindow()
    })
    app.on('ready',()=>{
        createWindow()
        require('./trayAndMenu')
        handleIPC()
        require('./robot.js')()
    })
    app.on('before-quit',()=>{
        closeMainWindow()
    })
    app.on('activate',()=>{
        showMainWindow()
    })
}


