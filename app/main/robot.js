const {ipcMain,screen} = require('electron')
const robot = require('robotjs')

const {scaleFactor} = screen.getPrimaryDisplay()


function handleMouseClick(data) {
    handleMouseMove(data)
    // type 只能是 left 或 right,暂不响应其他类型的鼠标点击事件
    if (data.type) {
        robot.mouseClick(data.type)
    }

}

function handleMouseMove({clientX, clientY, screen, video}) {
    let x = clientX * screen.width / video.width * scaleFactor
    let y = clientY * screen.height / video.height * scaleFactor
    robot.moveMouse(x, y)
}

function handleMouseDrag({startClientX, startClientY, endClientX, endClientY, screen, video}) {
    let startX = startClientX * screen.width / video.width * scaleFactor
    let startY = startClientY * screen.height / video.height * scaleFactor
    let endX = endClientX * screen.width / video.width * scaleFactor
    let endY = endClientY * screen.height / video.height * scaleFactor
    robot.moveMouse(startX, startY)
    robot.mouseToggle("down");
    robot.dragMouse(endX, endY);
    robot.mouseToggle("up");

}

function handleKey(data) {
    const modifiers = []
    if (data.meta) modifiers.push('meta')
    if (data.shift) modifiers.push('shift')
    if (data.alt) modifiers.push('alt')
    if (data.ctrl) modifiers.push('ctrl')
    let key = data.key
    try {
        robot.keyTap(key, modifiers)
    } catch (e) {
        console.log(`the  unsupported key is ${key}`, e)
    }

}

module.exports = function () {
    ipcMain.on('robot', (e, type, data) => {
        if (type === 'mouse') {
            switch (data.action) {
                case "click":
                    handleMouseClick(data)
                    break;
                case "mousemove":
                    handleMouseMove(data)
                    break;
                case "drag":
                    handleMouseDrag(data)

            }

        } else if (type === 'key') {
            handleKey(data)
        }
    })
}

