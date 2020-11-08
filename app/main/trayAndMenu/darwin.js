const {app, Menu, Tray} = require('electron')
const path = require('path')
const {showMainWindow} = require('../window/main')
const {create: createAboutWindow} = require("../window/about")
let tray

function setTray() {
    tray = new Tray(path.resolve('__dirname', './icon_darwin.png'))
    tray.on('click', () => {
        showMainWindow()
    })
    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            {label: "显示", click: showMainWindow},
            {label: "退出", click: app.quit}
        ])
        tray.popUpContextMenu(contextMenu)
    })
}

function setAppMenu() {
    app.applicationMenu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    label: "About",
                    click: createAboutWindow
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {type: 'separator'},
                {role: 'quit'}
            ]
        },
        {role: 'fileMenu'},
        {role: 'windowMenu'},
        {role: 'editMenu'}
    ])
}

app.whenReady().then(() => {
    setTray()
    setAppMenu()
})
