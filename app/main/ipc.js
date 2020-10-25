const {ipcMain} = require('electron')
const {send:sendMainWindow} = require('./window/main')
const {createWindow:createControlWindow,send:sendControlWindow} = require('./window/control')
const signal = require('./singal')
module.exports = function () {
    ipcMain.handle('login',async ()=>{
       const {code} = await signal.invoke('login',null,'login')
        return code
    })
    ipcMain.on('control',async (e,remote)=>{
       signal.send('control',{remote})
    })
    signal.on('controlled',(data)=>{
        createControlWindow()
        sendMainWindow('control-state-change',data.remote,1)
    })
    signal.on('be-controlled',(data)=>{
        sendMainWindow('control-state-change',data.remote,2)
    })
    ipcMain.on('forward',(e,event,data)=>{
        signal.send('forward',{event,data})
    })
    signal.on('offer', (data)=>{
        sendMainWindow('offer',data)
    } )
    signal.on('answer',(data)=>{
        sendControlWindow('answer',data)
    })
    signal.on('puppet-candidate',(data)=>{
        sendControlWindow('candidate',data)
    })
    signal.on('control-candidate',(data)=>{
        sendMainWindow('candidate',data)
    })

}