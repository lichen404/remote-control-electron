const {ipcMain} = require('electron')
const {send: sendMainWindow} = require('./window/main')
const {createWindow: createControlWindow, send: sendControlWindow} = require('./window/control')
const {createWebSocketConnection, createWebSocketServer} = require('./singal')
let code, signal
module.exports = function () {
    ipcMain.handle('login', () => {
        code = Math.floor(Math.random() * 999999).toString()
        createWebSocketServer(code)
        return code
    })

    ipcMain.on('control', async(e, payload) => {
        const dst = `ws://${payload.remoteIp}:8010`
        signal = await createWebSocketConnection(dst)
        signal.send('control', {code: payload.remoteCode, ip: payload.remoteIp})
        signal.on('controlled', (data) => {
            createControlWindow()
            sendMainWindow('control-state-change', data.remote, 1)
        })
        signal.on('be-controlled', (data) => {
            sendMainWindow('control-state-change', data.remote, 2)
        })
        ipcMain.on('forward', (e, event, data) => {
            signal.send('forward', {event, data})
        })
        signal.on('offer', (data) => {
            sendMainWindow('offer', data)
        })
        signal.on('answer', (data) => {
            sendControlWindow('answer', data)
        })
        signal.on('puppet-candidate', (data) => {
            sendControlWindow('candidate', data)
        })
        signal.on('control-candidate', (data) => {
            sendMainWindow('candidate', data)
        })
    })


}