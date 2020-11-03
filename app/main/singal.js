const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()
const {getIPAddress} = require('./utils/getIP')
const createWebSocketConnection = async (address) => {

    console.log(address)
    const ws = new WebSocket(address)
    const whenConnected = new Promise((resolve => {
        ws.on('open', () => {
            console.log('connect success')
            resolve()
        })
    }))
    await whenConnected
    signal.send = (event, data) => {
        ws.send(JSON.stringify({event, data}))
    }

    ws.on('error',(e)=>{
        console.log(e)
    })
    ws.on('message', (message) => {
        let data = {};
        try {
            data = JSON.parse(message)
        } catch (e) {
            console.log('parse error', e)
        }
        console.log(data)
        if(data.event==='forward'){
            signal.emit(data.data.event, data.data.data)
        }
        else {
            signal.emit(data.event,data.data)
        }

    })



}
const createWebSocketServer = (code) => {
    const wss = new WebSocket.Server({port: 8011})
    wss.on('error', (error) => {
        signal.emit('error',error.message)
    })
    wss.on('connection', function (ws) {
        const ip = getIPAddress()

        ws.sendData = (event, data) => {
            ws.send(JSON.stringify({event, data}))
        }
        signal.send = ws.sendData
        ws.sendError = (msg) => {

            ws.sendData('error', {msg})
        }
        ws.on('message', (message) => {
            let parsedMessage = {}
            try {
                parsedMessage = JSON.parse(message)
            } catch (e) {
                ws.sendError('message invalid')
                console.log('parse message error', e)
            }
            let {event, data} = parsedMessage
            if (event === 'login') {
                ws.sendData('login', {code})
            } else if (event === 'control') {

                if (data.code === code) {

                    signal.emit('be-controlled', {remote: ip})
                    ws.sendData('controlled',{remote:ip})
                } else {
                    ws.sendError('wrong code')
                }
            } else if (event === 'forward') {

                signal.emit(data.event, data.data)
            }
        })
        ws.on('close', () => {

            clearTimeout(ws._closeTimeout)
        })
        ws._closeTimeout = setTimeout(() => {
            ws.terminate()
        }, 10 * 60 * 1000)
    })


}


module.exports = {signal,createWebSocketConnection, createWebSocketServer}
