const  {createWindow} = require( "./window/main");
const {createWindow:createControlWindow} = require('./window/control')
const {app} = require('electron')
const handleIPC = require('./ipc')

app.on('ready',()=>{
    // createWindow()
    createControlWindow()
    handleIPC()
})
