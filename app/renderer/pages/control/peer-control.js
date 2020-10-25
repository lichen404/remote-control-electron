const EventEmitter = require('events')
const peer = new EventEmitter()
const {ipcRenderer, desktopCapturer} = require('electron')

async function getScreenStream() {
    const sources = await desktopCapturer.getSources({
        types: ['screen']
    })
    navigator.getUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sources[0].id,
                maxWidth: window.screen.width,
                maxHeight: window.screen.height
            }
        }
    }, (stream) => {
        peer.emit('add-stream', stream)
    }, (err) => {
        console.log(err)
    })

}

getScreenStream().then()

const pc = new window.RTCPeerConnection({})
const dc = pc.createDataChannel('robot-channel',{reliable:false})
dc.onopen = ()=>{
//     peer.on('robot', (type, data) => {
//     if (type === 'mouse') {
//         data.screen = {width: window.screen.width, height: window.screen.height}
//     }
//     setTimeout(() => {
//         ipcRenderer.send('robot', type, data)
//     }, 2000)
// })
    peer.on('robot',(type,data)=>{
        dc.send(JSON.stringify(type,data))
    })
}
dc.onmessage = (event)=>{
    console.log('message',event)
}
dc.onerror =(e)=>{console.log('error',e)}
pc.onicecandidate = function (e) {
    console.log('candidate', JSON.stringify(e.candidate))
    if (e.candidate) {
        ipcRenderer.send('forward', 'control-candidate', e.candidate)
    }
}
ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(candidate).then()
})
let candidates = []

async function addIceCandidate(candidate) {
    if (candidate) {
        candidates.push(candidate)
    }
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (const c of candidates) {
            await pc.addIceCandidate(new RTCIceCandidate(c))
        }
        candidates = []
    }

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