const peer = require('./peer-control')

peer.on('add-stream',(stream)=>{
    play(stream)
})
function play(stream) {
    let video = document.querySelector('#screen-video')
    video.srcObject = stream
    video.onloadedmetadata = ()=>{
        video.play()
    }
}