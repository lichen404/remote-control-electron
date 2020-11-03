const {ipcMain,app,dialog} = require('electron')
const {send: sendMainWindow} = require('./window/main')
const {createWindow: createControlWindow, send: sendControlWindow} = require('./window/control')
const {createWebSocketConnection, createWebSocketServer,signal} = require('./singal')
const {getIPAddress} = require('./utils/getIP')
let code
module.exports = function () {
    ipcMain.handle('init', () => {
        const ip = getIPAddress()
        code = Math.floor(Math.random() * 999999).toString()
        createWebSocketServer(code)
        signal.on('error',()=>{
            dialog.showErrorBox('webSocket 服务启动失败','请确保你本机的8010端口可用')
            app.quit()
        })
        return {code,ip}
    })
    signal.on('be-controlled', async (data) => {
        sendMainWindow('control-state-change', data.remote, 2)
        const dst = `ws://${data.remote}:8010`
        await createWebSocketConnection(dst)
        ipcMain.on('forward', (e, event, data) => {

            signal.send('forward', {event, data})


        })
    })
    signal.on('controlled', (data) => {
        createControlWindow()
        sendMainWindow('control-state-change', data.remote, 1)
    })
    signal.on('offer', (data) => {
        sendMainWindow('offer', data)
    })
    signal.on('answer', (data) => {
        console.log('执行了')
        sendControlWindow('answer', data)
    })
    signal.on('puppet-candidate', (data) => {
        sendControlWindow('candidate', data)
    })
    signal.on('control-candidate', (data) => {
        sendMainWindow('candidate', data)
    })



    ipcMain.on('control', async(e, payload) => {
        const dst = `ws://${payload.remoteIp}:8010`
        await createWebSocketConnection(dst)
        signal.send('control', {code: payload.remoteCode})
        ipcMain.on('forward', (e, event, data) => {

            signal.send('forward', {event, data})


        })

    })


}
