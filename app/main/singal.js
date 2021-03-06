const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()
const {getIPAddress} = require('./utils/getIP')

const localIp = getIPAddress()
const createWebSocketConnection = (payload) => {
    const ws = new WebSocket(`ws://${payload.remoteIp}:8010`)
    ws.on('open', () => {
        console.log(' websocket connect puppet to success')
        signal.emit('connected', payload)

    })
    ws.on('error', (e) => {
        console.log(' websocket connect to puppet failed')
        signal.emit('websocket-connect-error', e.message)

    })

    signal.send = (event, data) => {
        ws.send(JSON.stringify({event, data}))
    }
    ws.on('message', (message) => {
        let data = {}
        try {
            data = JSON.parse(message)
        } catch (e) {
            console.log('parse error', e)
        }
        if (data.event === 'cancel-control') {
            ws.terminate()

        }
        signal.emit(data.event, data.data)


    })


}
const createWebSocketServer = (code) => {
    const wss = new WebSocket.Server({port: 8010})
    wss.on('error', (error) => {
        signal.emit('websocket-server-init-error', error.message)
    })
    wss.on('connection', function (ws) {
        console.log('controller connected to puppet')
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

            if (event === 'control') {
                if (data.code === code) {
                    console.log('has been controlled')
                    signal.emit('be-controlled', {remoteIp: data.ip})
                    ws.sendData('controlled', {remoteIp: localIp})
                } else {
                    ws.sendError('wrong code')
                    ws.terminate()
                }
            } else {

                signal.emit(event, data)
            }
        })


    })


}


module.exports = {signal, createWebSocketConnection, createWebSocketServer}
