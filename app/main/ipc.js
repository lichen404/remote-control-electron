const {ipcMain, app, dialog} = require('electron')
const {send: sendMainWindow} = require('./window/main')
const {createWindow: createControlWindow, send: sendControlWindow,closeWindow:closeControlWindow} = require('./window/control')
const {createWebSocketConnection, createWebSocketServer, signal} = require('./singal')
const {getIPAddress} = require('./utils/getIP')
const localIp = getIPAddress()
let code
module.exports = function () {
    ipcMain.handle('init', () => {

        code = Math.random().toString().slice(-6)
        createWebSocketServer(code)

        return {code, ip: localIp}
    })
    signal.on('be-controlled', async (data) => {
        console.log(`has been controlled by ${data.remoteIp}`)
        sendMainWindow('control-state-change', {status: 'be-controlled', data: data.remoteIp})
        ipcMain.on('forward', (e, event, data) => {
            signal.send(event, data)
        })
    })
    signal.on('websocket-server-init-error', (errorMsg) => {
        console.log('error', errorMsg)
        dialog.showErrorBox('webSocket 服务启动失败', '请确保你本机的8010端口可用')
        app.quit()
    })
    signal.on('websocket-connect-error', (errorMsg) => {
        dialog.showErrorBox('连接中断',errorMsg)
    })

    signal.on('error',(payload)=>{
        if(payload.msg==='wrong code'){
            dialog.showErrorBox('建立连接失败', '请输入正确的控制码')
        }
        else {
            dialog.showErrorBox('UnhandledError',payload.msg)
        }
    })
    signal.on('controlled', (data) => {
        console.log(`has controlled ${data.remoteIp}`)
        createControlWindow()
        sendMainWindow('control-state-change', {status: 'controlled', data: data.remoteIp})
    })
    signal.on('offer', (data) => {
        console.log(' emit offer event')
        sendMainWindow('offer', data)
    })

    signal.on('answer', (data) => {
        console.log('emit answer event')
        sendControlWindow('answer', data)
    })
    signal.on('control-candidate', (data) => {
        console.log('puppet has got candidates from controller')
        sendMainWindow('candidate', data)
    })
    ipcMain.on('cancel-control',(e)=>{
        closeControlWindow()
        sendMainWindow('control-state-change',{status:'cancel-control'})
        //TODO
    })
    ipcMain.on('control', async (e, payload) => {

        const dst = `ws://${payload.remoteIp}:8010`
        sendMainWindow('control-state-change', {status: 'loading'})
        try {
            await createWebSocketConnection(dst)
            sendMainWindow('control-state-change', {status: 'loading-close'})
            signal.send('control', {code: payload.remoteCode, ip: localIp})
            ipcMain.on('forward', (e, event, data) => {
                console.log(`controller emit ${event} event to puppet`)
                signal.send(event, data)
            })
        } catch (e) {
            console.log('websocket connect failed', e.message)
            dialog.showErrorBox('连接建立失败', '请检查网络或输入正确的IP地址')
        }
        sendMainWindow('control-state-change', {status: 'loading-close'})

    })


}
