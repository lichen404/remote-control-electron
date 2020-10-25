const WebSocket = require('ws')
const wss = new WebSocket.Server({port:8010})
const code2ws = new Map()
wss.on('connection',function (ws) {
    let code = Math.floor(Math.random()*999999)
    code2ws.set(code,ws)
    ws.sendData = (event,data)=>{
        ws.send(JSON.stringify({event,data}))
    }
    ws.sendError = (msg)=>{
        ws.sendData('error',{msg})
    }
    ws.on('message',(message)=>{
        let parsedMessage = {}
        try {
            parsedMessage = JSON.parse(message)
        }catch(e){
            ws.send('message invalid')
            console.log('parse message error',e)
        }
        let {event,data} = parsedMessage
        if(event ==='login'){
            ws.sendData('login',{code})
        }
        else if(event==='control'){
            let remote =+ data.remote
            if(code2ws.has(remote)){
                ws.sendData('controlled',{remote})
                ws.sendRemote = code2ws.get(remote).sendData
                code2ws.get(remote).sendRemote = ws.sendData
                ws.sendRemote('be-controlled',{remote:code})
            }
        }
        else if(event ==='forward'){
             ws.sendRemote(data.event,data.data)
        }
    })
    ws.on('close',()=>{
        code2ws.delete(code)
        clearTimeout(ws._closeTimeout)
    })
    ws._closeTimeout = setTimeout(()=>{
        ws.terminate()
    },10*60*1000)
})