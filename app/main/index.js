const  {createWindow} = require( "./window/main");
const {app} = require('electron')
const handleIPC = require('./ipc')
app.allowRendererProcessReuse = false;
app.on('ready',()=>{
    createWindow()

    handleIPC()
    require('./robot.js')()
})
