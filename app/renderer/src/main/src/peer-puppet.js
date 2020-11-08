import EventEmitter from 'events'
import {ipcRenderer, desktopCapturer} from 'electron'

let peer = new EventEmitter()

ipcRenderer.on('offer', (e, offer) => {
    console.log('init pc', offer)
    const pc = new window.RTCPeerConnection({});
    pc.ondatachannel = (e) => {

        e.channel.onmessage = (e) => {
            console.log('onmessage',JSON.parse(e.data))
            let {type, data} = JSON.parse(e.data)

            if (type === 'mouse') {
                data.screen = {
                    width: window.screen.width,
                    height: window.screen.height
                }
            }
            ipcRenderer.send('robot', type, data)
        }
    }

    async function getScreenStream() {
        const sources = await desktopCapturer.getSources({types: ['screen']})
        return new Promise((resolve, reject) => {
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
                console.log('add-stream', stream)
                resolve(stream)
            }, reject)
        })
    }

    ipcRenderer.on('candidate', (e, candidate) => {
        addIceCandidate(JSON.parse(candidate)).then()
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
    async function createAnswer(offer) {
        let stream = await getScreenStream()
        pc.addStream(stream)
        await pc.setRemoteDescription(offer);
        await pc.setLocalDescription(await pc.createAnswer());
        console.log('create answer \n', JSON.stringify(pc.localDescription))
        // send answer
        return pc.localDescription
    }

    createAnswer(offer).then((answer) => {
        ipcRenderer.send('forward', 'answer', {type: answer.type, sdp: answer.sdp})
    })

})
export default peer
