const EventEmitter = require('events')
const peer = new EventEmitter()
const {desktopCapturer} = require('electron')
async function getScreenStream(){
    const sources = await desktopCapturer.getSources({
        types:['screen']
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
module.exports = peer