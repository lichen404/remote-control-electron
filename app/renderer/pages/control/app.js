const peer = require('./peer-control')
const keyTable =require('keyTable')
peer.on('add-stream',(stream)=>{
    play(stream)
})
let video = document.querySelector('#screen-video')
function play(stream) {

    video.srcObject = stream
    video.onloadedmetadata = ()=>{
        video.play()
    }
}
window.onkeydown = function (e) {

    let data ={
        key:keyTable[e.key] || e.key.toLowerCase(),
        shift:e.shiftKey,
        meta:e.metaKey,
        control:e.ctrlKey,
        alt:e.altKey
    }
    peer.emit('robot','key',data)
}
window.onmouseup = function (e){
    window.onmousemove = handleMousemove
    end = [e.clientX,e.clientY]
    if(end[0]===start[0] && end[1]===start[1]){
       data = {
           ...data,
           clientX:e.clientX,
           clientY:e.clientY,
           action:'click'
       }


    }
    else {
        data = {
            ...data,
            endClientX:end[0],
            endClientY:end[1],
            startClientX:start[0],
            startClientY:start[1],
            action:'drag'

        }

    }
    peer.emit('robot','mouse',data)
}
let start,end,data
window.onmousedown = function (e) {
    window.onmousemove = null;
    if(e.button===0){
        data = {
            type: 'left',
            video:{
                width:video.getBoundingClientRect().width,
                height:video.getBoundingClientRect().height
            }

        }
        start = [e.clientX,e.clientY]
    }
    else {
        if(e.button===2){
            data = {
            action:'click',
            type:'right',
            clientX:e.clientX,
            clientY:e.clientY,
            video:{
                width:video.getBoundingClientRect().width,
                height:video.getBoundingClientRect().height
            }
        }
            peer.emit('robot','mouse',data)
        }
    }

}

const handleMousemove = (e)=>{
    let data = {
        action:'mousemove',
        clientX:e.clientX,
        clientY:e.clientY,
        video:{
            width:video.getBoundingClientRect().width,
            height:video.getBoundingClientRect().height
        }
    }
    peer.emit('robot','mouse',data)
}

window.onmousemove = handleMousemove

