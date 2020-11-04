const EventEmitter = require('events')
const peer = new EventEmitter()
const {ipcRenderer} = require('electron')


const pc = new window.RTCPeerConnection({})
const dc = pc.createDataChannel('robot-channel',{reliable:false})
dc.onopen = ()=>{
    peer.on('robot',(type,data)=>{
        dc.send(JSON.stringify({type,data}))
    })
}
dc.onmessage = (event)=>{
    console.log('message',event)
}
dc.onerror =(e)=>{console.log('error',e)}
pc.onicecandidate = function (e) {
    console.log('candidate', JSON.stringify(e.candidate))
    if (e.candidate) {
        ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
    }
}
pc.onaddstream = (e)=>{
    console.log('addStream',e)
    peer.emit('add-stream',e.stream)
}

async function setRemote(answer) {
    await pc.setRemoteDescription(answer)
}

ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer).then()
})

async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    })
    await pc.setLocalDescription(offer)
    return pc.localDescription
}

createOffer().then((offer) => {
    ipcRenderer.send('forward', 'offer', {type: offer.type, sdp: offer.sdp})
})
module.exports = peer
